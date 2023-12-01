import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {SettingsService} from "../services/settings.service";

@Component({
  selector: 'app-chat-prompt-component',
  templateUrl: './chat-prompt.component.html',
  styleUrls: ['./chat-prompt.component.css']
})
export class ChatPromptComponent implements AfterViewInit{
  isLoading: boolean;
  messageInput: string = '';
  @ViewChild('messageInputArea') messageInputRef;
  @Output() sendMessage = new EventEmitter<{message: string, image: string}>();
  @Output() resendMessage = new EventEmitter<any>();
  imagePreview: string = '';

  constructor(private cdr: ChangeDetectorRef,
              private settingsService: SettingsService) {
  }

  ngAfterViewInit() {
    this.messageInputRef.nativeElement.focus();
  }

  onSendClick() {
    if (!this.messageInput) {
      this.resendMessage.emit();
    } else {
      this.sendMessage.emit({message: this.messageInput, image: this.imagePreview});
      this.imagePreview = '';
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
    if(this.settingsService.quickSendEnabled) {
      this.onSendClick();
    }
  }

  updateImagePreview(preview: string) {
    this.imagePreview = preview;
  }

  onEnterSend($event) {
    $event.preventDefault();
    this.onSendClick();
  }
}
