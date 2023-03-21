import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  OpenAIApi
} from "openai";
import {ChatCompletionRequestMessage, CreateImageRequest} from "openai/dist/api";
import showdown from 'showdown';
import {HttpClient} from "@angular/common/http";
import {IntroModalComponent} from "./intro-modal/intro-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {SettingsService} from "./services/settings.service";
import {ChatContainerComponent} from "./chat-container/chat-container.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  chatHistory: Array<ChatCompletionRequestMessage> = [];
  converter = new showdown.Converter({
    tables: true, emoji: true, underline: true, openLinksInNewWindow: true, tasklists: true,
    strikethrough: true, simplifiedAutoLink: true
  });

  @ViewChild('messageContainer', {static: false}) messageContainer: ElementRef;
  @ViewChild('toolbarComponent') toolbarComponent: ToolbarComponent;
  @ViewChild('chatContainerComponent') chatContainer: ChatContainerComponent;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              public settings: SettingsService) {
  }

  ngOnInit(): void {
    if (!this.settings.apiKey) {
      this.openIntroDialog();
    }
  }

  openIntroDialog() {
    const dialogRef = this.dialog.open(IntroModalComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res.apiKey) {
        this.settings.apiKey = res.apiKey;
        localStorage.setItem('apiKey', this.settings.apiKey);
        this.settings.refreshApiKey.emit();
      }
    });
  }

  async sendMessage(message: string) {
    if (!message) {
      return;
    }

    this.chatHistory.push({content: message, role: ChatCompletionRequestMessageRoleEnum.User});

    localStorage.setItem('apiKey', this.settings.apiKey);
    localStorage.setItem('temperature', this.settings.temperature.toString());
    localStorage.setItem('maxTokens', this.settings.maxTokens.toString());
    localStorage.setItem('selectedModel', this.settings.selectedModel);

    this.chatContainer.messages.push({
      content: message,
      contentRaw: message,
      timestamp: new Date(),
      avatar: '<img src="/assets/person.png" alt="Chatworm" width="50px"/>',
      isUser: true
    });

    this.chatContainer.chatbotTyping = true;
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 0);

    const endpoints = [
      {
        endpoint: 'createChatCompletion',
        payload: {
          model: this.settings.selectedModel,
          messages: this.chatHistory,
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens,
        } as CreateChatCompletionRequest
      },
      {
        endpoint: 'createCompletion',
        payload: {
          model: this.settings.selectedModel,
          prompt: this.chatContainer.messages[this.chatContainer.messages.length - 1].content,
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens,
        } as CreateCompletionRequest
      },
      {
        endpoint: 'createImage',
        payload: {
          prompt: this.chatContainer.messages[this.chatContainer.messages.length - 1].content,
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
      this.chatContainer.messages.push({
        content: this.converter.makeHtml(message),
        contentRaw: messageRaw,
        timestamp: new Date(),
        avatar: '<img src="/assets/chatworm_simple.png" alt="Chatworm" width="50px"/>',
        isUser: false,
      });
    }
    this.chatContainer.highlightCode();
    this.chatContainer.chatbotTyping = false;

    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }

  private handleFinalErrorResponse(error) {
    this.chatContainer.chatbotTyping = false;

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

  async resendLastMessage() {
    if (this.chatHistory.length > 0) {
      let lastMessage = this.chatHistory
        .filter(message => message.role === ChatCompletionRequestMessageRoleEnum.User)
        .pop().content;
      await this.sendMessage(lastMessage);
    }
  }

  private getOpenAi() {
    const configuration = new Configuration({
      apiKey: this.settings.apiKey,
    });
    return new OpenAIApi(configuration);
  }
}
