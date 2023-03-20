import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-chat-prompt-component',
  templateUrl: './chat-prompt-component.component.html',
  styleUrls: ['./chat-prompt-component.component.css']
})
export class ChatPromptComponentComponent implements AfterViewInit{
  isLoading: boolean;
  messageInput: string = '';
  @ViewChild('messageInputArea') messageInputRef;
  @Input() apiKey: string;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() resendMessage = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.messageInputRef.nativeElement.focus();
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
