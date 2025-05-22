import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { AudioComponent } from './audio/audio.component';
import { ImageCameraComponent } from './image-camera/image-camera.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chat-prompt-component',
  standalone: true,
  templateUrl: './chat-prompt.component.html',
  imports: [
    AudioComponent,
    ImageCameraComponent,
    CdkTextareaAutosize,
    FormsModule,
    MatProgressSpinner,
  ],
  styleUrls: ['./chat-prompt.component.css'],
})
export class ChatPromptComponent implements AfterViewInit {
  isLoading: boolean;
  messageInput: string = '';
  @ViewChild('messageInputArea') messageInputRef;
  @Output() sendMessage = new EventEmitter<{ message: string; image: string }>();
  @Output() resendMessage = new EventEmitter<any>();
  imagePreview: string = '';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly settingsService: SettingsService,
  ) {}

  ngAfterViewInit() {
    this.messageInputRef.nativeElement.focus();
  }

  onSendClick() {
    if (!this.messageInput) {
      this.resendMessage.emit();
    } else {
      this.sendMessage.emit({ message: this.messageInput, image: this.imagePreview });
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
    if (this.settingsService.quickSendEnabled) {
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
