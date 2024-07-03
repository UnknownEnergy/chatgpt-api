import {EventEmitter, Injectable, Input} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  apiKey: string = '';
  apiKeyAnthropic: string = '';
  selectedModel: string = 'gpt-4o';
  temperature: number = 0.7;
  maxTokens: number = 512;
  textToSpeechEnabled: boolean = true;
  voice: string = 'alloy';
  quickSendEnabled: boolean = true;
  refreshApiKey = new EventEmitter<string>();
  autoSwitchEnabled: boolean = true;
  saveMoneyEnabled: boolean = false;
  corsProxy: string = 'https://schweiger.quest:9999/';

  constructor() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
    const savedAnthropicApiKey = localStorage.getItem('apiKeyAnthropic');
    if (savedAnthropicApiKey) {
      this.apiKeyAnthropic = savedAnthropicApiKey;
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
    const savedQuickSendEnabled = localStorage.getItem('quickSendEnabled');
    if (savedQuickSendEnabled) {
      this.quickSendEnabled = JSON.parse(savedQuickSendEnabled);
    }
    const autoSwitchEnabled = localStorage.getItem('autoSwitchEnabled');
    if (autoSwitchEnabled) {
      this.autoSwitchEnabled = JSON.parse(autoSwitchEnabled);
    }
    const saveMoneyEnabled = localStorage.getItem('saveMoneyEnabled');
    if (saveMoneyEnabled) {
      this.saveMoneyEnabled = JSON.parse(saveMoneyEnabled);
    }
    const savedCorsProxy = localStorage.getItem('corsProxy');
    if (savedCorsProxy) {
      this.corsProxy = savedCorsProxy;
    }
  }
}
