import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as RecordRTC from 'recordrtc';
import {Configuration, OpenAIApi} from "openai";
import {AxiosRequestConfig} from "axios";

@Component({
  selector: 'app-audio-component',
  templateUrl: './audio-component.component.html',
  styleUrls: ['./audio-component.component.css']
})
export class AudioComponentComponent implements OnInit{

  @Input() apiKey: string;
  @Output() audioTextUpdated = new EventEmitter<string>();
  @Output() isLoading = new EventEmitter<boolean>();
  private stream: MediaStream;
  private recordRTC: RecordRTC;
  private openAi;

  constructor() {
  }

  ngOnInit(): void {
    this.openAi = this.getOpenAi();
  }

  public getOpenAi() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
      formDataCtor: CustomFormData
    });
    return new OpenAIApi(configuration);
  }

  recording = false;

  toggleRecording() {
    if (this.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
    this.recording = !this.recording;
  }


  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.recordRTC = new RecordRTC(stream, {
        type: 'audio',
      });
      this.recordRTC.startRecording();
    });
  }

  stopRecording() {
    this.recordRTC.stopRecording(() => {
      const blob = this.recordRTC.getBlob();
      const file = new File([blob], 'recorded-audio.wav');
      this.isLoading.emit(true);
      this.openAi.createTranscription(file, 'whisper-1')
        .then((response) => {
          this.audioTextUpdated.emit(response.data.text);
          this.isLoading.emit(false);
        });
    });
    this.stream.getTracks().forEach((track) => track.stop());
  }
  openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';

    input.addEventListener('change', () => {
      const file = input.files[0];
      this.isLoading.emit(true);
      this.openAi.createTranscription(file, 'whisper-1', )
        .then((response) => {
          this.audioTextUpdated.emit(response.data.text);
          this.isLoading.emit(false);
        });
    });

    input.click();
  }

}

class CustomFormData extends FormData {
  getHeaders() {
    return {}
  }
}
