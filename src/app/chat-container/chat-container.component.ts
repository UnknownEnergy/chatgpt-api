import {Component, ElementRef, ViewChild} from '@angular/core';
import {HighlightService} from "../services/highlight.service";

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent {
  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatbotTyping = false;

  @ViewChild('messageContainer') private messageContainer: ElementRef;

  constructor(
    private highlightService: HighlightService
  ) {
  }

  public highlightCode() {
    this.highlightService.highlightAll();
  }

  scrollToLastMessage(): void {
    setTimeout(() => {
      const lastMessage = this.messageContainer.nativeElement.querySelector('.chat-message:last-of-type');
      if (lastMessage) {
        lastMessage.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }, 0);
  }
}
