import {Injectable} from '@angular/core';
import {ChatCompletionRequestMessage} from "openai/dist/api";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatHistory: Array<ChatCompletionRequestMessage> = [];
  currentChatName: string = '';

  constructor() {
  }
}
