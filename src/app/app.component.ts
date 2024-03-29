import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import OpenAI from "openai";
import showdown from 'showdown';
import {IntroModalComponent} from "./intro-modal/intro-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {SettingsService} from "./services/settings.service";
import {ChatContainerComponent} from "./chat-container/chat-container.component";
import {MessageService} from "./services/message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  converter = new showdown.Converter({
    tables: true, emoji: true, underline: true, openLinksInNewWindow: true, tasklists: true,
    strikethrough: true, simplifiedAutoLink: true
  });

  @ViewChild('toolbarComponent') toolbarComponent: ToolbarComponent;
  @ViewChild('chatContainerComponent') chatContainer: ChatContainerComponent;

  constructor(private dialog: MatDialog,
              public settings: SettingsService,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef,) {
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

  async sendMessage(message: string, image: string) {
    if (!message) {
      return;
    }

    this.autoSwitchModel(message, image);

    if (image) {
      this.messageService.chatHistory.push({
        // @ts-ignore
        content: [
          {
            type: "text",
            text: message
          },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ],
        // @ts-ignore
        role: 'user'
      });
    } else {
      // @ts-ignore
      this.messageService.chatHistory.push({content: message, role: 'user'});
    }

    localStorage.setItem('apiKey', this.settings.apiKey);
    localStorage.setItem('temperature', this.settings.temperature.toString());
    localStorage.setItem('maxTokens', this.settings.maxTokens.toString());
    localStorage.setItem('selectedModel', this.settings.selectedModel);

    this.messageService.messages.push({
      content: message,
      contentRaw: message,
      timestamp: new Date(),
      avatar: '<img src="/assets/person.png" alt="Chatworm" width="50px"/>',
      isUser: true,
      image: image
    });

    this.chatContainer.chatbotTyping = true;
    setTimeout(() => {
      this.chatContainer.scrollToLastMessage();
    }, 100);

    const endpoints = [
      {
        endpoint: 'chat.completions.create',
        payload: {
          model: this.settings.selectedModel,
          messages: this.messageService.chatHistory,
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens,
        } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
      },
      {
        endpoint: 'completions.create',
        payload: {
          model: this.settings.selectedModel,
          prompt: this.messageService.messages[this.messageService.messages.length - 1].content,
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens,
        } as OpenAI.CompletionCreateParamsNonStreaming
      },
      {
        endpoint: 'images.generate',
        restrictModel: 'DALL·E·3',
        payload: {
          model: "dall-e-3",
          prompt: this.messageService.messages[this.messageService.messages.length - 1].content,
        } as OpenAI.Images.ImageGenerateParams
      },
      {
        endpoint: 'images.generate',
        restrictModel: 'DALL·E·2',
        payload: {
          model: "dall-e-2",
          prompt: this.messageService.messages[this.messageService.messages.length - 1].content,
        } as OpenAI.Images.ImageGenerateParams
      }
    ];

    this.cdr.detectChanges();

    const ai = this.getOpenAi()
    this.callEndpoints(0, ai, endpoints, this.settings.selectedModel, '');
  }

  private autoSwitchModel(message: string, image: string) {
    if (this.settings.autoSwitchEnabled) {
      const lastMessage = this.messageService.chatHistory[this.messageService.chatHistory.length - 1];
      const containsArrayContent = lastMessage ? Array.isArray(lastMessage.content) : false;
      if(image || containsArrayContent) {
        this.settings.selectedModel = 'gpt-4-vision-preview';
        return;
      }

      const first35Chars = message.toLowerCase().substring(0, 35);
      const imageDrawingPhrases = ['draw an image', 'draw a picture', 'sketch a picture', 'create an illustration',
        'generate a visual', 'draw an icon', 'draw a graphic', 'illustrate an image', 'design an icon',
        'create a visual', 'generate a drawing', 'sketch a mockup', 'render an illustration', 'produce a picture',
        'craft an image', 'draft a graphic', 'formulate a drawing', 'construct an icon', 'compose a visual',
        'paint a picture', 'draw a diagram', 'sketch an artwork', 'design a logo', 'create a cartoon',
        'zeichne ein bild', 'male ein bild', 'zeichne ein diagram', 'male ein diagram', 'zeichne eine grafik', 'male ein grafik',
        'erstelle ein bild', 'erstelle eine grafik', 'erstelle eine zeichnung', 'erstelle ein diagram', 'zeichne eine zeichnung'];

      if (imageDrawingPhrases.some(phrase => first35Chars.includes(phrase))) {
        this.settings.selectedModel = 'DALL·E·3';
      } else if (this.settings.saveMoneyEnabled) {
        this.settings.selectedModel = 'gpt-3.5-turbo-0125';
      } else {
        this.settings.selectedModel = 'gpt-4-0125-preview';
      }
    }
  }

  callEndpoints(index, ai, endpoints, model, error) {
    if (index >= endpoints.length) {
      this.handleFinalErrorResponse(error);
      return;
    }

    if (endpoints[index].restrictModel && model !== endpoints[index].restrictModel) {
      this.callEndpoints(index + 1, ai, endpoints, model, error);
      return;
    }

    const payload = endpoints[index].payload;

    if (endpoints[index].endpoint === 'chat.completions.create') {
      ai.chat.completions.create(payload)
        .then(response => {
          this.handleSuccessResponse(response);
        })
        .catch(error => {
          if (error && error.type === 'invalid_request_error' && error.message.includes("image_url is only supported by certain models")) {
            // Modify the payload format
            const modifiedPayload = { ...payload };
            modifiedPayload.messages = modifiedPayload.messages.map(message => {
              const newContent = {
                content: '',
                role: 'user'
              };
              if (Array.isArray(message.content)) {
                console.log(message.content)
                message.content.forEach(contentItem => {
                  if (contentItem.type === 'text') {
                    newContent.content += contentItem.text;
                  }
                });
                console.log(newContent)
                return newContent;
              }
              return message;
            });

            // Retry the endpoint with the modified payload
            ai.chat.completions.create(modifiedPayload)
              .then(response => {
                this.handleSuccessResponse(response);
              })
              .catch(retryError => {
                this.callEndpoints(index + 1, ai, endpoints, model, retryError);
              });
            return;
          } else if (error && error.type === 'invalid_request_error') {
            this.callEndpoints(index + 1, ai, endpoints, model, error);
            return;
          }
          this.handleFinalErrorResponse(error);
        });
    } else if (endpoints[index].endpoint === 'completions.create') {
      ai.completions.create(payload)
        .then(response => {
          this.handleSuccessResponse(response);
        })
        .catch(error => {
          if (error && error.type === 'invalid_request_error') {
            this.callEndpoints(index + 1, ai, endpoints, model, error);
            return;
          }
          this.handleFinalErrorResponse(error);
        });
    } else if (endpoints[index].endpoint === 'images.generate') {
      ai.images.generate(payload)
        .then(response => {
          this.handleSuccessResponse(response);
        })
        .catch(error => {
          if (error && error.type === 'invalid_request_error') {
            this.callEndpoints(index + 1, ai, endpoints, model, error);
            return;
          }
          this.handleFinalErrorResponse(error);
        });
    }
  }

  private handleSuccessResponse(response) {
    if (response && response) {
      let message = '';
      if (response.choices && response.choices[0].message) {
        message = response.choices[0].message.content;
      } else if (response.data && response.data[0].url) {
        message = '<img src="' + response.data[0].url + '" height="300px"/>';
      } else {
        message = response.choices[0].text;
      }
      let messageRaw = message;
      this.messageService.chatHistory.push({content: messageRaw, role: 'assistant'});
      let messageObj = {
        content: this.converter.makeHtml(message),
        contentRaw: messageRaw,
        timestamp: new Date(),
        avatar: '<img src="/assets/chatworm_simple.png" alt="Chatworm" width="50px"/>',
        isUser: false,
      };
      if (!response.data || !response.data[0].url) {
        this.textToSpeak(messageRaw, messageObj);
      }
      this.messageService.messages.push(messageObj);
    }
    this.chatContainer.highlightCode();
    this.chatContainer.chatbotTyping = false;
    this.chatContainer.scrollToLastMessage();
    this.cdr.detectChanges();
  }

  private textToSpeak(messageRaw: string, messageObj: any) {
    if (!this.settings.textToSpeechEnabled) {
      return;
    }

    const ai = this.getOpenAi()
    ai.audio.speech.create({
      model: "tts-1",
      // @ts-ignore
      voice: this.settings.voice,
      input: messageRaw,
    }).then(async response => {
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        messageObj.audioUrl = reader.result;
        messageObj.audioAutoplay = true;
      };
    });
  }

  private handleFinalErrorResponse(error) {
    this.chatContainer.chatbotTyping = false;
    this.chatContainer.scrollToLastMessage();

    if (error.response && error.response && error.response.error) {
      alert(error.response.error.message);
    } else {
      alert(error.message);
      throw error;
    }
  }

  async resendLastMessage() {
    if (this.messageService.chatHistory.length > 0) {
      let lastMessage = this.messageService.chatHistory
        // @ts-ignore
        .filter(message => message.role === 'user')
        .pop().content;
      await this.sendMessage(lastMessage, '');
    }
  }

  private getOpenAi() {

    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}
