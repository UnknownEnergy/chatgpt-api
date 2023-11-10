import {EventEmitter, Injectable, Input} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  apiKey: string = '';
  selectedModel: string = 'gpt-3.5-turbo-1106';
  temperature: number = 0.7;
  maxTokens: number = 512;
  textToSpeechEnabled: boolean = false;
  voice: string = 'alloy';
  refreshApiKey = new EventEmitter<string>();

  constructor() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
    const savedTemperature = localStorage.getItem('temperature');
    if (savedTemperature) {
      this.temperature = parseFloat(savedTemperature);
    }
    const saveMaxTokens = localStorage.getItem('maxTokens');
    if (saveMaxTokens) {
      this.maxTokens = parseInt(saveMaxTokens);
    }
    const savedSelectedModel = localStorage.getItem('selectedModel');
    if (savedSelectedModel) {
      this.selectedModel = savedSelectedModel;
    }
    const savedTextToSpeechEnabled = localStorage.getItem('textToSpeechEnabled');
    if (savedTextToSpeechEnabled) {
      this.textToSpeechEnabled = JSON.parse(savedTextToSpeechEnabled);
    }
    const savedVoice = localStorage.getItem('voice');
    if (savedVoice) {
      this.voice = savedVoice;
    }
  }
}
