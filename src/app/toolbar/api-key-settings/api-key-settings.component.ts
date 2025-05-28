import {Component, inject} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-api-key-settings',
  standalone: true,
  templateUrl: './api-key-settings.component.html',
  imports: [FormsModule],
  styleUrls: ['./api-key-settings.component.css'],
})
export class ApiKeySettingsComponent {
  public readonly settings = inject(SettingsService);

  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  showPassword4: boolean = false;
  showPassword5: boolean = false;
  showPassword6: boolean = false;
  showPassword7: boolean = false;
  showPassword8: boolean = false;

  constructor() {
  }

  onTypeApiKey() {
    this.refreshModels();
    localStorage.setItem('apiKey', this.settings.apiKey);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyAnthropic() {
    this.refreshModels();
    localStorage.setItem('apiKeyAnthropic', this.settings.apiKeyAnthropic);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyGemini() {
    this.refreshModels();
    localStorage.setItem('apiKeyGemini', this.settings.apiKeyGemini);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyDeepSeek() {
    this.refreshModels();
    localStorage.setItem('apiKeyDeepSeek', this.settings.apiKeyDeepSeek);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyQwen() {
    this.refreshModels();
    localStorage.setItem('apiKeyQwen', this.settings.apiKeyQwen);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyGrok() {
    this.refreshModels();
    localStorage.setItem('apiKeyGrok', this.settings.apiKeyGrok);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyMistral() {
    this.refreshModels();
    localStorage.setItem('apiKeyMistral', this.settings.apiKeyMistral);
    this.settings.refreshApiKey.emit();
  }

  onTypeApiKeyStepFun() {
    this.refreshModels();
    localStorage.setItem('apiKeyStepFun', this.settings.apiKeyStepFun);
    this.settings.refreshApiKey.emit();
  }

  openApiKeyWebsite() {
    window.open('https://platform.openai.com/account/api-keys', '_blank');
  }

  openApiKeyAnthrophicWebsite() {
    window.open('https://console.anthropic.com/settings/keys', '_blank');
  }

  openApiKeyGeminiWebsite() {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  }

  openApiKeyDeepSeekWebsite() {
    window.open('https://platform.deepseek.com/api_keys', '_blank');
  }

  openApiKeyQwenWebsite() {
    window.open('https://bailian.console.alibabacloud.com/?apiKey=1#/api-key', '_blank');
  }

  openApiKeyGrokWebsite() {
    window.open('https://console.x.ai/', '_blank');
  }

  openApiKeyMistralWebsite() {
    window.open('https://console.mistral.ai/api-keys/', '_blank');
  }

  openApiKeyStepFunWebsite() {
    window.open('https://platform.stepfun.com/interface-key', '_blank');
  }

  private refreshModels() {
    this.settings.refreshApiKey.emit();
  }
}
