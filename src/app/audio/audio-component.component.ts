import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as RecordRTC from 'recordrtc';
import {Configuration, OpenAIApi} from "openai";
import {FocusMonitor} from "@angular/cdk/a11y";

@Component({
  selector: 'app-audio-component',
  templateUrl: './audio-component.component.html',
  styleUrls: ['./audio-component.component.css']
})
export class AudioComponentComponent implements OnInit {

  @Input() apiKey: string;
  @Output() audioTextUpdated = new EventEmitter<string>();
  @Output() isLoading = new EventEmitter<boolean>();
  private stream: MediaStream;
  private recordRTC: RecordRTC;
  private openAi;
  public recording = false;

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


  startRecording() {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.recordRTC = new RecordRTC(stream, {
        type: 'audio',
      });
      this.recordRTC.startRecording();
    });
  }

  stopRecording() {
    this.recording = false;
    this.recordRTC.stopRecording(() => {
      const blob = this.recordRTC.getBlob();
      const file = new File([blob], 'recorded-audio.wav');
      this.isLoading.emit(true);
      this.openAi.createTranscription(file, 'whisper-1')
        .then((response) => {
          this.audioTextUpdated.emit(response.data.text);
          this.isLoading.emit(false);
        })
        .catch(error => {
          this.isLoading.emit(false);
          if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error.message);
          } else {
            alert(error.message);
            throw error;
          }
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
        }).catch(error => {
        this.isLoading.emit(false);
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error.message);
        } else {
          alert(error.message);
          throw error;
        }
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
