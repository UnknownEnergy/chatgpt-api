import {Component} from '@angular/core';
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {SettingsService} from "../../services/settings.service";
import Model = OpenAI.Model;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  showPassword4: boolean = false;
  models: Model[] = [];

  constructor(public settings: SettingsService) {
    this.refreshModels();
    this.settings.refreshApiKey.subscribe(() => {
      this.refreshModels();
    });
  }

  refreshModels() {
    const predefinedModels = this.getPredefinedModels();
    const predefinedIds = new Set(predefinedModels.map(m => m.id));
    const seenIds = new Set(predefinedIds);

    Promise.all([
      this.fetchOpenAIModels(),
      this.fetchAnthropicModels(),
      this.fetchGeminiModels(),
      this.fetchDeepSeekModels()
    ])
      .then(([openAiModels, anthropicModels, geminiModels, deepSeekModels]) => {
        const apiModels = [...(openAiModels || []), ...(anthropicModels || []), ...(geminiModels || []), ...(deepSeekModels || [])]
          .filter(model => {
            if (!model || seenIds.has(model.id)) {
              return false;
            }
            seenIds.add(model.id);
            return !predefinedIds.has(model.id);
          })
          .sort((a, b) => a.id.localeCompare(b.id));

        this.models = [...predefinedModels, ...apiModels];
      })
      .catch(error => {
        console.error("Error refreshing models:", error);
        this.models = predefinedModels;
      });
  }

  private fetchOpenAIModels(): Promise<Model[]> {
    const openai = this.getOpenAi();
    return openai.models.list()
      .then(response => {
        console.log('OpenAI models:', response);
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching OpenAI models:", error);
        return [];
      });
  }

  private fetchAnthropicModels(): Promise<any[]> {
    const anthropic = new Anthropic({
      apiKey: this.settings.apiKeyAnthropic,
      dangerouslyAllowBrowser: true
    });

    return anthropic.models.list()
      .then(response => {
        console.log('Anthropic models:', response);
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching Anthropic models:", error);
        return [];
      });
  }

  private async fetchGeminiModels(): Promise<any[]> {
    try {
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKeyGemini;
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const modelsResponse = await apiResponse.json();
      console.log('Fetched Gemini models via REST:', modelsResponse);

      return this.extractModelIds(modelsResponse.models) || [];
    } catch (restError) {
      console.error("Error fetching Gemini models via REST API:", restError);
      return [];
    }
  }

  extractModelIds(models) {
    return models.map(model => {
      const modelName = model.name.split('/')[1];
      return {
        id: modelName,
        object: 'model',
        created: 0,
        owned_by: 'gemini'
      };
    });
  }

  private async fetchDeepSeekModels(): Promise<any[]> {
    try {
      const apiUrl = 'https://api.deepseek.com/v1/models';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.settings.apiKeyDeepSeek}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const modelsResponse = await response.json();
      console.log('Fetched DeepSeek models:', modelsResponse);

      // Extract model IDs and return them
      return modelsResponse.data.map(model => ({
        id: model.id,
        object: model.object,
        created: 0,
        owned_by: 'deepseek'
      })) || [];
    } catch (error) {
      console.error("Error fetching DeepSeek models:", error);
      return [];
    }
  }

  private getPredefinedModels(): Model[] {
    return [
      {id: 'gpt-4o-2024-11-20', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4o', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4o-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o1', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o1-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o3-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'dall-e-3', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'claude-3-5-sonnet-latest', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-5-haiku-latest', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'deepseek-reasoner', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'deepseek-chat', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'deepseek-coder', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'gemini-exp-1206', object: 'model', created: 0, owned_by: 'gemini'},
      {id: 'gemini-2.0-flash-thinking-exp-1219', object: 'model', created: 0, owned_by: 'gemini'},
      {id: 'gemini-2.0-flash-exp', object: 'model', created: 0, owned_by: 'gemini'},
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

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  openApiKeyAnthrophicWebsite() {
    window.open("https://console.anthropic.com/settings/keys", "_blank");
  }

  openApiKeyGeminiWebsite() {
    window.open("https://aistudio.google.com/app/apikey", "_blank");
  }

  openApiKeyDeepSeekWebsite() {
    window.open("https://platform.deepseek.com/api_keys", "_blank");
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

  private getOpenAi() {
    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  isOpen: boolean = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectModel(modelId: string) {
    this.settings.selectedModel = modelId; // Set the selected model
    this.isOpen = false; // Close the dropdown
  }

  getSelectedModel() {
    return this.models.find(model => model.id === this.settings.selectedModel)?.id;
  }

  isPredefinedModel(model: Model): boolean {
    const predefinedModels = this.getPredefinedModels();
    return predefinedModels.some(predefined => predefined.id === model.id);
  }
}
