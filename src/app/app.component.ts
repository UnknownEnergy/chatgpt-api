import { ChangeDetectorRef, Component, inject, OnInit, viewChild } from '@angular/core';
import OpenAI from 'openai';
import showdown from 'showdown';
import { IntroModalComponent } from './intro-modal/intro-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SettingsService } from './services/settings.service';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { MessageService } from './services/message.service';
import { Audio } from 'openai/resources';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mistral } from '@mistralai/mistralai';
import { ChatPromptComponent } from './chat-prompt/chat-prompt.component';
import { HeaderComponent } from './header/header.component';

type SpeechCreateParams = Audio.SpeechCreateParams;

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ChatPromptComponent, ChatContainerComponent, ToolbarComponent, HeaderComponent],
})
export class AppComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly settings = inject(SettingsService);
  private readonly messageService = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly toolbarComponent = viewChild<ToolbarComponent>('toolbarComponent');
  readonly chatContainer = viewChild<ChatContainerComponent>('chatContainerComponent');

  converter = new showdown.Converter({
    tables: true,
    emoji: true,
    underline: true,
    openLinksInNewWindow: true,
    tasklists: true,
    strikethrough: true,
    simplifiedAutoLink: true,
  });

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

  sendMessage(message: string, image: string) {
    if (!message) {
      return;
    }

    this.updateChatHistory(message, image);
    this.saveSettings();
    this.addUserMessage(message, image);

    this.chatContainer().chatbotTyping = true;
    setTimeout(() => {
      this.chatContainer().scrollToLastMessage();
    }, 100);

    this.cdr.detectChanges();

    const ai = this.getAIClient();
    const isClaudeModel = this.isClaudeModel(this.settings.selectedModel);
    const isGeminiModel = this.isGeminiModel(this.settings.selectedModel);
    const isDeepSeekModel = this.isDeepSeekModel(this.settings.selectedModel);
    const isQwenModel = this.isQwenModel(this.settings.selectedModel);
    const isMistralModel = this.isMistralModel(this.settings.selectedModel);
    const isStepFunModel = this.isStepFunModel(this.settings.selectedModel);

    try {
      let response: any;
      if (isGeminiModel) {
        response = this.callGeminiAPI(message, image);
      } else if (isClaudeModel) {
        response = this.callClaudeAPI(ai as Anthropic, message, image);
      } else if (isDeepSeekModel) {
        response = this.callOpenAIAPI(ai as OpenAI, message, image);
      } else if (isQwenModel) {
        response = this.callOpenAIAPI(ai as OpenAI, message, image);
      } else if (isMistralModel) {
        response = this.callMistralAPI(ai as Mistral, message, image);
      } else if (isStepFunModel) {
        response = this.callOpenAIAPI(ai as OpenAI, message, image);
      } else {
        response = this.callOpenAIAPI(ai as OpenAI, message, image);
      }
      this.handleSuccessResponse(response);
    } catch (error) {
      this.handleErrorResponse(error);
    } finally {
      this.chatContainer().chatbotTyping = false;
      this.chatContainer().scrollToLastMessage();
      this.cdr.detectChanges();
    }
  }

  resendLastMessage() {
    if (this.messageService.chatHistory.length > 0) {
      const lastMessage = this.messageService.chatHistory
        // @ts-ignore
        .filter((message) => message.role === 'user')
        .pop().content;
      this.sendMessage(lastMessage, '');
    }
  }

  private updateChatHistory(message: string, image: string) {
    if (image) {
      this.messageService.chatHistory.push({
        // @ts-ignore
        content: [
          { type: 'text', text: message },
          { type: 'image_url', image_url: { url: image } },
        ],
        // @ts-ignore
        role: 'user',
      });
    } else {
      // @ts-ignore
      this.messageService.chatHistory.push({ content: message, role: 'user' });
    }
  }

  private saveSettings() {
    localStorage.setItem('apiKey', this.settings.apiKey);
    localStorage.setItem('apiKeyAnthropic', this.settings.apiKeyAnthropic);
    localStorage.setItem('apiKeyGemini', this.settings.apiKeyGemini);
    localStorage.setItem('apiKeyMistral', this.settings.apiKeyMistral);
    localStorage.setItem('apiKeyStepFun', this.settings.apiKeyStepFun);
    localStorage.setItem('temperature', this.settings.temperature.toString());
    localStorage.setItem('maxTokens', this.settings.maxTokens.toString());
    localStorage.setItem('reasoningEffort', this.settings.reasoningEffort);
    localStorage.setItem('selectedModel', this.settings.selectedModel);
  }

  private addUserMessage(message: string, image: string) {
    this.messageService.messages.push({
      content: message,
      contentRaw: message,
      timestamp: new Date(),
      avatar: '<img src="/assets/person.png" alt="Chatworm" width="50px"/>',
      isUser: true,
      image: image,
    });
  }

  private callClaudeAPI(anthropic: Anthropic, message: string, image: string | null) {
    const content: Anthropic.ContentBlock[] = [
      {
        type: 'text',
        text: message,
        citations: null,
      },
    ];

    if (image) {
      content.push({
        // @ts-ignore
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg', // Adjust this based on your image type
          data: image.split(',')[1], // Assuming image is a base64 string
        },
      });
    }

    return anthropic.messages.create({
      model: this.settings.selectedModel,
      max_tokens: this.settings.maxTokens,
      temperature: this.settings.temperature,
      messages: this.messageService.chatHistory,
      system: 'You are a helpful AI assistant.',
    });
  }

  private callOpenAIAPI(openai: OpenAI, message: string, image: string) {
    const isCompletionTokensModel = /o\d+/.test(this.settings.selectedModel);

    if (this.settings.selectedModel.includes('dall-e')) {
      return openai.images.generate({
        model: this.settings.selectedModel,
        prompt: message,
      });
    } else {
      return openai.chat.completions.create({
        model: this.settings.selectedModel,
        messages: this.messageService.chatHistory,
        ...(isCompletionTokensModel ? {} : { temperature: this.settings.temperature }),
        ...(isCompletionTokensModel
          ? { max_completion_tokens: this.settings.maxTokens }
          : { max_tokens: this.settings.maxTokens }),
        ...(isCompletionTokensModel ? { reasoning_effort: this.settings.reasoningEffort } : {}),
      } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);
    }
  }

  private async callGeminiAPI(message: string, image: string | null) {
    const genAI = new GoogleGenerativeAI(this.settings.apiKeyGemini);
    const model = genAI.getGenerativeModel({ model: this.settings.selectedModel });

    const chat = model.startChat({
      history: this.messageService.chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    try {
      const result = await chat.sendMessage(message);

      return result.response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  private async callMistralAPI(mistral: Mistral, message: string, image: string | null) {
    return mistral.chat.complete({
      model: this.settings.selectedModel,
      messages: this.messageService.chatHistory,
      temperature: this.settings.temperature,
      maxTokens: this.settings.maxTokens,
    });
  }

  private handleSuccessResponse(promise: any) {
    promise
      .then(async (response) => {
        let message = '';

        if (this.isDeepSeekModel(this.settings.selectedModel)) {
          message = response.choices[0].message.content;
        } else if (this.isClaudeModel(this.settings.selectedModel)) {
          message = response.content[0].text;
        } else if (this.isGeminiModel(this.settings.selectedModel)) {
          message = response.candidates[0].content.parts[0].text;
        } else if (this.isQwenModel(this.settings.selectedModel)) {
          message = response.choices[0].message.content;
        } else if (this.isMistralModel(this.settings.selectedModel)) {
          message = response.choices[0].message.content;
        } else if (this.isStepFunModel(this.settings.selectedModel)) {
          message = response.choices[0].message.content;
        } else message = response.choices?.[0].message?.content;

        const messageRaw = message;
        this.messageService.chatHistory.push({
          content: messageRaw,
          role: 'assistant',
          refusal: '',
        });
        const messageObj = {
          content: this.converter.makeHtml(message),
          contentRaw: messageRaw,
          timestamp: new Date(),
          avatar: '<img src="../assets/chatworm_simple.png" alt="Chatworm" width="50px"/>',
          isUser: false,
        };

        if (!response.data || !response.data[0].url) {
          await this.textToSpeak(messageRaw, messageObj);
        }

        this.messageService.messages.push(messageObj);
        this.chatContainer().highlightCode();
        this.chatContainer().chatbotTyping = false;
        this.chatContainer().scrollToLastMessage();
        this.cdr.detectChanges();
      })
      .catch((error: any) => {
        this.handleErrorResponse(error);
      });
  }

  private handleErrorResponse(error: any) {
    this.chatContainer().chatbotTyping = false;
    this.chatContainer().scrollToLastMessage();

    if (error.response?.error) {
      alert(error.response.error.message);
    } else {
      alert(error.message);
      throw error;
    }
  }

  private async textToSpeak(messageRaw: string, messageObj: any) {
    if (!this.settings.textToSpeechEnabled) {
      return;
    }

    const ai = this.getAIClient();
    if (ai instanceof OpenAI) {
      await ai.audio.speech
        .create(<SpeechCreateParams>{
          model: 'tts-1',
          voice: this.settings.voice,
          input: messageRaw,
        })
        .then(async (response) => {
          const arrayBuffer = await response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            messageObj.audioUrl = reader.result;
            messageObj.audioAutoplay = true;
          };
        });
    }
  }

  private getAIClient() {
    if (this.isClaudeModel(this.settings.selectedModel)) {
      return this.getClaude();
    } else if (this.isDeepSeekModel(this.settings.selectedModel)) {
      return this.getDeepSeekOpenAi();
    } else if (this.isQwenModel(this.settings.selectedModel)) {
      return this.getQwenOpenAi();
    } else if (this.isGrokModel(this.settings.selectedModel)) {
      return this.getGrokOpenAi();
    } else if (this.isMistralModel(this.settings.selectedModel)) {
      return this.getMistral();
    } else if (this.isStepFunModel(this.settings.selectedModel)) {
      return this.getStepFun();
    }
    return this.getOpenAi();
  }

  private isClaudeModel(model: string): boolean {
    return model.toLowerCase().includes('claude');
  }

  private isGeminiModel(model: string): boolean {
    return model.toLowerCase().includes('gemini');
  }

  private isDeepSeekModel(model: string): boolean {
    return model.toLowerCase().includes('deepseek');
  }

  private isQwenModel(model: string): boolean {
    return model.toLowerCase().includes('qwen');
  }

  private isGrokModel(model: string): boolean {
    return model.toLowerCase().includes('grok');
  }

  private isMistralModel(model: string): boolean {
    return model.toLowerCase().includes('mistral');
  }

  private isStepFunModel(model: string): boolean {
    return model.toLowerCase().includes('step');
  }

  private getOpenAi() {
    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  private getDeepSeekOpenAi() {
    return new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.settings.apiKeyDeepSeek,
      dangerouslyAllowBrowser: true,
    });
  }

  private getQwenOpenAi() {
    return new OpenAI({
      baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
      apiKey: this.settings.apiKeyQwen,
      dangerouslyAllowBrowser: true,
    });
  }

  private getGrokOpenAi() {
    return new OpenAI({
      baseURL: 'https://api.x.ai/v1',
      apiKey: this.settings.apiKeyGrok,
      dangerouslyAllowBrowser: true,
    });
  }

  private getClaude() {
    return new Anthropic({
      fetch: async (url, init) => {
        return await fetch(url.toString(), init);
      },
      apiKey: this.settings.apiKeyAnthropic,
      dangerouslyAllowBrowser: true,
    });
  }

  private getMistral() {
    return new Mistral({
      apiKey: this.settings.apiKeyMistral,
    });
  }

  private getStepFun() {
    return new OpenAI({
      apiKey: this.settings.apiKeyStepFun,
      baseURL: 'https://api.stepfun.com/v1',
      dangerouslyAllowBrowser: true,
    });
  }
}
