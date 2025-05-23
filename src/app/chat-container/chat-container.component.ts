import { Component, ElementRef, ViewChild } from '@angular/core';
import { HighlightService } from '../services/highlight.service';
import { MessageService } from '../services/message.service';
import { SaveAsPdfComponent } from './save-as-pdf/save-as-pdf.component';
import { InfoComponent } from '../info-text/info.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  templateUrl: './chat-container.component.html',
  imports: [SaveAsPdfComponent, InfoComponent, DatePipe],
  styleUrls: ['./chat-container.component.css'],
})
export class ChatContainerComponent {
  chatbotTyping = false;

  @ViewChild('messageContainer') private readonly messageContainer: ElementRef;

  constructor(
    /* ... */
    private readonly highlightService: HighlightService,
    private readonly messageService: MessageService,
  ) {}

  public highlightCode() {
    this.highlightService.highlightAll();
  }

  getMessages() {
    return this.messageService.messages;
  }

  scrollToLastMessage(): void {
    setTimeout(() => {
      const lastMessage = this.messageContainer.nativeElement.querySelector(
        '.chat-message:last-of-type',
      );
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
