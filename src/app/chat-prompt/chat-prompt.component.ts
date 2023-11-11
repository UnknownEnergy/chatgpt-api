import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-chat-prompt-component',
  templateUrl: './chat-prompt.component.html',
  styleUrls: ['./chat-prompt.component.css']
})
export class ChatPromptComponent implements AfterViewInit{
  isLoading: boolean;
  messageInput: string = '';
  @ViewChild('messageInputArea') messageInputRef;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() resendMessage = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.messageInputRef.nativeElement.focus();
  }

  onSendClick() {
    if (!this.messageInput) {
      this.resendMessage.emit();
    } else {
      this.sendMessage.emit(this.messageInput);
      this.messageInput = '';
    }
  }

  changeLoading(loading: boolean) {
    this.isLoading = loading;
    this.cdr.detectChanges();
  }

  updateMessage(message: string) {
    this.messageInput = message;
    this.cdr.detectChanges();
  }
}
