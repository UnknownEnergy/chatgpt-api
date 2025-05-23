import { Component, ElementRef, inject, viewChild } from '@angular/core';
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
  private readonly highlightService = inject(HighlightService);
  private readonly messageService = inject(MessageService);

  private readonly messageContainer = viewChild.required<ElementRef>('messageContainer');

  chatbotTyping = false;

  public highlightCode() {
    this.highlightService.highlightAll();
  }

  getMessages() {
    return this.messageService.messages;
  }

  scrollToLastMessage(): void {
    setTimeout(() => {
      const lastMessage = this.messageContainer().nativeElement.querySelector(
        '.chat-message:last-of-type',
      );
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
