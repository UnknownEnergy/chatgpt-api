import {Component, ElementRef, ViewChild} from '@angular/core';
import {HighlightService} from "../services/highlight.service";
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent {

  chatbotTyping = false;

  @ViewChild('messageContainer') private messageContainer: ElementRef;

  constructor(
    /* ... */
    private highlightService: HighlightService,
    private messageService: MessageService
  ) {}

  public highlightCode() {
    this.highlightService.highlightAll();
  }

  getMessages() {
    return this.messageService.messages;
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
