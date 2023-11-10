import {Injectable} from '@angular/core';
import OpenAI from "openai";
import {ChatCompletionMessage} from "openai/src/resources/chat/completions";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatHistory: Array<OpenAI.ChatCompletionMessage> = [];
  currentChatName: string = '';

  constructor() {
  }
}
