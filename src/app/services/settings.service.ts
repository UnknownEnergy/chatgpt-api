import {EventEmitter, Injectable, Input} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  apiKey: string = '';
  apiKeyAnthropic: string = '';
  apiKeyGemini: string = "";
  apiKeyDeepSeek: string = "";
  apiKeyQwen: string = "";
  apiKeyGrok: string = "";
  selectedModel: string = 'gpt-4o';
  temperature: number = 0.7;
  maxTokens: number = 512;
  textToSpeechEnabled: boolean = true;
  voice: string = 'alloy';
  quickSendEnabled: boolean = true;
  refreshApiKey = new EventEmitter<string>();

  constructor() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
    const savedAnthropicApiKey = localStorage.getItem('apiKeyAnthropic');
    if (savedAnthropicApiKey) {
      this.apiKeyAnthropic = savedAnthropicApiKey;
    }
    const savedGeminiApiKey = localStorage.getItem('apiKeyGemini');
    if (savedGeminiApiKey) {
      this.apiKeyGemini = savedGeminiApiKey;
    }
    const savedDeepSeekApiKey = localStorage.getItem('apiKeyDeepSeek');
    if (savedDeepSeekApiKey) {
      this.apiKeyDeepSeek = savedDeepSeekApiKey;
    }
    const savedQwenApiKey = localStorage.getItem('apiKeyQwen');
    if (savedQwenApiKey) {
      this.apiKeyQwen = savedQwenApiKey;
    }
    const savedGrokApiKey = localStorage.getItem('apiKeyGrok');
    if (savedGrokApiKey) {
      this.apiKeyGrok = savedGrokApiKey;
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
  }
}
