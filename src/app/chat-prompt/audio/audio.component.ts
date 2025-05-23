import { Component, inject, OnInit, output } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import OpenAI from 'openai';
import { SettingsService } from '../../services/settings.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-audio-component',
  standalone: true,
  templateUrl: './audio.component.html',
  imports: [MatMenu, MatMenuTrigger],
  styleUrls: ['./audio.component.css'],
})
export class AudioComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  audioTextUpdated = output<string>();
  isLoading = output<boolean>();

  recordIcon: string = 'bi bi-mic';
  recordText: string = 'Hold to record';
  private stream: MediaStream;
  private recordRTC: RecordRTC;
  private openAi;

  ngOnInit(): void {
    this.openAi = this.getOpenAi();
    this.settings.refreshApiKey.subscribe(() => {
      this.openAi = this.getOpenAi();
    });
  }

  public getOpenAi() {
    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async startRecording() {
    this.recordIcon = 'bi bi-stop-circle';
    this.recordText = 'Release to stop';
    await navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.recordRTC = new RecordRTC(stream, {
        type: 'audio',
      });
      this.recordRTC.startRecording();
    });
  }

  stopRecording() {
    this.recordIcon = 'bi bi-mic';
    this.recordText = 'Hold to record';
    this.recordRTC.stopRecording(() => {
      const blob = this.recordRTC.getBlob();
      const file = new File([blob], 'recorded-audio.wav');
      this.callOpenAi(file);
    });
    this.stream.getTracks().forEach((track) => track.stop());
  }

  openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';

    input.addEventListener('change', () => {
      const file = input.files[0];
      this.callOpenAi(file);
    });
    input.click();
  }

  private callOpenAi(file: File) {
    this.isLoading.emit(true);
    this.openAi.audio.transcriptions
      .create({
        file: file,
        model: 'whisper-1',
      })
      .then((response) => {
        this.audioTextUpdated.emit(response.text);
        this.isLoading.emit(false);
      })
      .catch((error) => {
        this.isLoading.emit(false);
        if (error.response?.error) {
          alert(error.response.error.message);
        } else {
          alert(error.message);
          throw error;
        }
      });
  }
}
