import {Component, ElementRef, ViewChild} from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent {
  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatbotTyping = false;

  @ViewChild('messageContainer') private messageContainer: ElementRef;

  public highlightCode() {
    setTimeout(() => {
      hljs.highlightAll();
    }, 50);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }
}
