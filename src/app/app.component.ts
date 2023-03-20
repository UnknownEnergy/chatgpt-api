import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  Model,
  OpenAIApi
} from "openai";
import {ChatCompletionRequestMessage, CreateImageRequest} from "openai/dist/api";
import hljs from 'highlight.js';
import showdown from 'showdown';
import {HttpClient} from "@angular/common/http";
import {IntroModalComponent} from "./intro-modal/intro-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ToolbarComponent} from "./toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatbotTyping = false;
  apiKey = '';
  chatHistory: Array<ChatCompletionRequestMessage> = [];
  usedTokens: number = 0;
  showPassword: boolean = false;

  selectedModel: string = 'gpt-3.5-turbo';
  models: Model[] = [];

  @ViewChild('messageContainer', {static: false}) messageContainer: ElementRef;

  temperature: number = 0.7;
  maxTokens: number = 256;

  converter = new showdown.Converter({
    tables: true, emoji: true, underline: true, openLinksInNewWindow: true, tasklists: true,
    strikethrough: true, simplifiedAutoLink: true
  });

  @ViewChild('toolbarComponent') toolbarComponent: ToolbarComponent;

  constructor(private http: HttpClient,
              private dialog: MatDialog) {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
    const savedTemperature = localStorage.getItem('temperature');
    if (savedTemperature) {
      this.temperature = parseFloat(savedTemperature);
    }
    const saveMaxTokens = localStorage.getItem('maxTokens');
    if (saveMaxTokens) {
      this.maxTokens = parseInt(saveMaxTokens);
    }
    const savedSelectedModel = localStorage.getItem('selectedModel');
    if (savedSelectedModel) {
      this.selectedModel = savedSelectedModel;
    }

    this.refreshModels();
  }

  ngOnInit(): void {
    if (!this.apiKey) {
      this.openIntroDialog();
    }
  }

  openIntroDialog() {
    const dialogRef = this.dialog.open(IntroModalComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res.apiKey) {
        this.apiKey = res.apiKey;
        localStorage.setItem('apiKey', this.apiKey);
        this.refreshModels();
      }
    });
  }

  async sendMessage(message: string) {
    if (!message) {
      return;
    }

    this.chatHistory.push({content: message, role: ChatCompletionRequestMessageRoleEnum.User});

    localStorage.setItem('apiKey', this.apiKey);
    localStorage.setItem('temperature', this.temperature.toString());
    localStorage.setItem('maxTokens', this.maxTokens.toString());
    localStorage.setItem('selectedModel', this.selectedModel);

    this.messages.push({
      content: message,
      contentRaw: message,
      timestamp: new Date(),
      avatar: '<img src="/assets/person.png" alt="Chatworm" width="50px"/>',
      isUser: true
    });

    this.chatbotTyping = true;
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 0);

    const endpoints = [
      {
        endpoint: 'createChatCompletion',
        payload: {
          model: this.selectedModel,
          messages: this.chatHistory,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        } as CreateChatCompletionRequest
      },
      {
        endpoint: 'createCompletion',
        payload: {
          model: this.selectedModel,
          prompt: this.messages[this.messages.length - 1].content,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        } as CreateCompletionRequest
      },
      {
        endpoint: 'createImage',
        payload: {
          prompt: this.messages[this.messages.length - 1].content,
        } as CreateImageRequest
      }
    ];

    const openai = this.getOpenAi()
    this.callEndpoints(0, openai, endpoints);
  }

  callEndpoints(index, openai, endpoints) {
    if (index >= endpoints.length) {
      return;
    }

    const {endpoint, payload} = endpoints[index];
    openai[endpoint](payload)
      .then(response => {
        this.handleSuccessResponse(response);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.callEndpoints(index + 1, openai, endpoints);
          return;
        }
        this.handleFinalErrorResponse(error);
      });
  }

  private handleSuccessResponse(response) {
    if (response && response.data) {
      let message = '';
      if (response.data.choices && response.data.choices[0].message) {
        message = response.data.choices[0].message.content;
      } else if (response.data.data && response.data.data[0].url) {
        message = '<img src="' + response.data.data[0].url + '" height="500px"/>';
      } else {
        message = response.data.choices[0].text;
      }
      let messageRaw = message;
      this.chatHistory.push({content: messageRaw, role: ChatCompletionRequestMessageRoleEnum.Assistant});
      this.messages.push({
        content: this.converter.makeHtml(message),
        contentRaw: messageRaw,
        timestamp: new Date(),
        avatar: '<img src="/assets/chatworm_simple.png" alt="Chatworm" width="50px"/>',
        isUser: false,
      });
    }
    this.highlightCode();
    this.chatbotTyping = false;

    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }

  private handleFinalErrorResponse(error) {
    this.chatbotTyping = false;

    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);

    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error.message);
    } else {
      alert(error.message);
      throw error;
    }
  }

  private getOpenAi() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    return new OpenAIApi(configuration);
  }

  async resendLastMessage() {
    if (this.chatHistory.length > 0) {
      let lastMessage = this.chatHistory
        .filter(message => message.role === ChatCompletionRequestMessageRoleEnum.User)
        .pop().content;
      await this.sendMessage(lastMessage);
    }
  }

  refreshModels() {
    const openai = this.getOpenAi();
    openai.listModels().then(response => {
      this.models.push({
        created: 0,
        id: ' DALL·E',
        object: '',
        owned_by: ''
      } as Model);
      this.models = [...this.models, ...response.data.data];
      this.toolbarComponent.refreshUsage.emit();
    })
  }

  public highlightCode() {
    setTimeout(() => {
      hljs.highlightAll();
    }, 50);

  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  onTypeApiKey() {
    this.refreshModels();
    localStorage.setItem('apiKey', this.apiKey);
  }

  onInputOnlyAllowPositiveIntegers($event: KeyboardEvent) {
    const charCode = $event.charCode;
    if (charCode < 48 || charCode > 57) {
      $event.preventDefault();
    }
  }
}
