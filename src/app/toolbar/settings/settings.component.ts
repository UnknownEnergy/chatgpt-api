import {Component} from '@angular/core';
import OpenAI from "openai";
import {SettingsService} from "../../services/settings.service";
import Anthropic from "@anthropic-ai/sdk";
import Model = OpenAI.Model;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showPassword: boolean = false;
  showPassword2: boolean = false;
  models: Model[] = [];

  constructor(public settings: SettingsService) {
    this.refreshModels();
    this.settings.refreshApiKey.subscribe(() => {
      this.refreshModels();
    });
  }

  refreshModels() {
    this.models = this.getPredefinedModels();
  }

  private async fetchOpenAIModels(): Promise<Model[]> {
    const openai = this.getOpenAi();
    try {
      const response = await openai.models.list();
      return response.data;
    } catch (error) {
      console.error("Error fetching OpenAI models:", error);
      return [];
    }
  }

  private getPredefinedModels(): Model[] {
    return [
      {id: 'gpt-4o', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4-turbo', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-3.5-turbo', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'DALL·E·3', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'claude-3-5-sonnet-20240620', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-opus-20240229', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-haiku-20240307', object: 'model', created: 0, owned_by: 'anthropic'},
    ];
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

  onTypeCorsProxy() {
    localStorage.setItem('corsProxy', this.settings.corsProxy);
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  openApiKeyAnthrophicWebsite() {
    window.open("https://console.anthropic.com/settings/keys", "_blank");
  }

  onInputOnlyAllowPositiveIntegers($event: KeyboardEvent) {
    const charCode = $event.charCode;
    if (charCode < 48 || charCode > 57) {
      $event.preventDefault();
    }
  }

  onTextToSpeechChange(event: Event) {
    localStorage.setItem('textToSpeechEnabled', JSON.stringify(this.settings.textToSpeechEnabled));
  }

  onVoiceChange(event: Event) {
    localStorage.setItem('voice', this.settings.voice);
  }

  onQuickSendChange(event: Event) {
    localStorage.setItem('quickSendEnabled', JSON.stringify(this.settings.quickSendEnabled));
  }

  onAutoSwitchChange(event: Event) {
    localStorage.setItem('autoSwitchEnabled', JSON.stringify(this.settings.autoSwitchEnabled));
  }

  onSaveMoneyChange($event: Event) {
    localStorage.setItem('saveMoneyEnabled', JSON.stringify(this.settings.saveMoneyEnabled));
  }

  private getOpenAi() {
    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}
