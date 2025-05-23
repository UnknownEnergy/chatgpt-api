import { Injectable } from '@angular/core';
import OpenAI from 'openai';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: {
    content: string;
    contentRaw: string;
    isRaw?: boolean;
    timestamp: Date;
    avatar: string;
    isUser: boolean;
    audioUrl?: string;
    audioAutoplay?: boolean;
    image?: string;
  }[] = [];
  chatHistory: Array<OpenAI.ChatCompletionMessage> = [];
  currentChatName: string = '';

  constructor() {}
}
