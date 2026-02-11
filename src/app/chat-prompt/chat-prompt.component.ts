import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { AudioComponent } from './audio/audio.component';
import { ImageCameraComponent } from './image-camera/image-camera.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

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
    NgIf,
  ],
  styleUrls: ['./chat-prompt.component.css'],
})
export class ChatPromptComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly settingsService = inject(SettingsService);

  readonly messageInputRef = viewChild.required<ElementRef>('messageInputArea');

  sendMessage = output<{ message: string; image?: string; file?: File | null }>();
  resendMessage = output<void>();

  isLoading = false;
  messageInput = '';
  imagePreview = '';
  uploadedFile: File | null = null;

  ngAfterViewInit() {
    this.messageInputRef().nativeElement.focus();
  }

  onSendClick() {
    if (!this.messageInput && !this.imagePreview && !this.uploadedFile) {
      this.resendMessage.emit();
      return;
    }
    this.sendMessage.emit({
      message: this.messageInput,
      image: this.imagePreview,
      file: this.uploadedFile,
    });
    // clear inputs after send
    this.messageInput = '';
    this.imagePreview = '';
    this.uploadedFile = null;
    this.cdr.detectChanges();
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

  onFileUploadSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      // Optionally, you can generate a preview or filename display here
      this.cdr.detectChanges();
    }
  }

  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
    this.cdr.detectChanges();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    this.cdr.detectChanges();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadedFile = event.dataTransfer.files[0];
      this.cdr.detectChanges();

      event.dataTransfer.clearData();
    }
  }

  downloadFile() {
    if (!this.uploadedFile) return;

    const url = window.URL.createObjectURL(this.uploadedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.uploadedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
