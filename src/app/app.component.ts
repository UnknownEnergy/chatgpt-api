import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  Model,
  OpenAIApi
} from "openai";
import {TipModalComponent} from "./tip-modal-component/tip-modal.component";
import {ChatCompletionRequestMessage, CreateImageRequest} from "openai/dist/api";
import hljs from 'highlight.js';
import showdown from 'showdown';
import {HttpClient} from "@angular/common/http";
import {IntroModalComponent} from "./intro-modal-component/intro-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {InfoModalComponent} from "./info-modal-component/info-modal.component";

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
  darkModeEnabled = false;
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

  isChatHeaderCollapsed = true;

  total_granted: number = 0;
  total_used: number = 0;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
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
    const savedIsChatHeaderCollapsed = localStorage.getItem('isChatHeaderCollapsed');
    if (savedIsChatHeaderCollapsed) {
      this.isChatHeaderCollapsed = JSON.parse(savedIsChatHeaderCollapsed);
    }
    const savedIsDarkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (savedIsDarkModeEnabled) {
      this.darkModeEnabled = JSON.parse(savedIsDarkModeEnabled);
    }

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
    });

    this.refreshModels();
  }

  ngOnInit(): void {
    if (!this.apiKey) {
      this.openIntroDialog();
    }

    if (this.isChatHeaderCollapsed) {
      const chatHeader = document.getElementsByClassName('chat-settings')[0];
      chatHeader.classList.toggle('collapsed');
    }
    if (this.darkModeEnabled) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('dark');
    }

    setInterval(this.refreshCredits, 300000);
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

  openTipDialog() {
    this.dialog.open(TipModalComponent);
  }

  openInfoDialog() {
    this.dialog.open(InfoModalComponent);
  }

  async sendMessage(message: string) {
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
      this.refreshCredits();
    })
  }

  public highlightCode() {
    setTimeout(() => {
      hljs.highlightAll();
    }, 50);

  }

  refreshCredits() {
    const url = 'https://api.openai.com/dashboard/billing/credit_grants';
    const options = {
      headers: {
        "authorization": "Bearer " + this.apiKey,
      },
    };
    this.http.get(url, options).subscribe((data: any) => {
      this.total_granted = data.total_granted;
      this.total_used = data.total_used;
    });
  }

  openUsageWebsite() {
    window.open("https://platform.openai.com/account/usage", "_blank");
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  toggleChatHeader() {
    const chatHeader = document.getElementsByClassName('chat-settings')[0];
    chatHeader.classList.toggle('collapsed');
    this.isChatHeaderCollapsed = !this.isChatHeaderCollapsed;
    localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    const body = document.getElementsByTagName('body')[0];
    if (this.darkModeEnabled) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('darkModeEnabled', JSON.stringify(this.darkModeEnabled));
  }

  onTypeApiKey() {
    this.refreshModels();
    localStorage.setItem('apiKey', this.apiKey);
  }
}
