import {Component, inject} from '@angular/core';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import {SettingsService} from '../../services/settings.service';
import {Mistral} from '@mistralai/mistralai';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

type Model = OpenAI.Model;

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  imports: [FormsModule, NgClass],
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  public readonly settings = inject(SettingsService);
  models: Model[] = [];
  isOpen: boolean = false;

  constructor() {
    this.refreshModels();
    this.settings.refreshApiKey.subscribe(() => {
      this.refreshModels();
    });
  }

  refreshModels() {
    const predefinedModels = this.getPredefinedModels();
    const predefinedIds = new Set(predefinedModels.map((m) => m.id));
    const seenIds = new Set(predefinedIds);

    Promise.all([
      this.fetchOpenAIModels(),
      this.fetchAnthropicModels(),
      this.fetchGeminiModels(),
      this.fetchDeepSeekModels(),
      this.fetchMistralModels(),
      this.fetchStepFunModels(),
      this.fetchGrokModels(),
    ])
      .then(
        ([
           openAiModels,
           anthropicModels,
           geminiModels,
           deepSeekModels,
           mistralModels,
           stepFunModels,
           grokModels,
         ]) => {
          const apiModels = [
            ...(openAiModels || []),
            ...(anthropicModels || []),
            ...(geminiModels || []),
            ...(deepSeekModels || []),
            ...(mistralModels || []),
            ...(stepFunModels || []),
            ...(grokModels || []),
          ]
            .filter((model) => {
              if (!model || seenIds.has(model.id)) {
                return false;
              }
              seenIds.add(model.id);
              return !predefinedIds.has(model.id);
            })
            .sort((a, b) => a.id.localeCompare(b.id));

          this.models = [...predefinedModels, ...apiModels];
        },
      )
      .catch((error) => {
        console.error('Error refreshing models:', error);
        this.models = predefinedModels;
      });
  }

  extractModelIds(models) {
    return models.map((model) => {
      const modelName = model.name.split('/')[1];
      return {
        id: modelName,
        object: 'model',
        created: 0,
        owned_by: 'gemini',
      };
    });
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

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectModel(modelId: string) {
    this.settings.selectedModel = modelId; // Set the selected model
    this.isOpen = false; // Close the dropdown
  }

  getSelectedModel() {
    return this.models.find((model) => model.id === this.settings.selectedModel)?.id;
  }

  isPredefinedModel(model: Model): boolean {
    const predefinedModels = this.getPredefinedModels();
    return predefinedModels.some((predefined) => predefined.id === model.id);
  }

  private fetchOpenAIModels(): Promise<Model[]> {
    const openai = this.getOpenAi();
    return openai.models
      .list()
      .then((response) => {
        console.log('OpenAI models:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching OpenAI models:', error);
        return [];
      });
  }

  private fetchAnthropicModels(): Promise<any[]> {
    const anthropic = new Anthropic({
      apiKey: this.settings.apiKeyAnthropic,
      dangerouslyAllowBrowser: true,
    });

    return anthropic.models
      .list()
      .then((response) => {
        console.log('Anthropic models:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching Anthropic models:', error);
        return [];
      });
  }

  private async fetchGeminiModels(): Promise<any[]> {
    try {
      const apiUrl =
        'https://generativelanguage.googleapis.com/v1beta/models?key=' + this.settings.apiKeyGemini;
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const modelsResponse = await apiResponse.json();
      console.log('Fetched Gemini models via REST:', modelsResponse);

      return this.extractModelIds(modelsResponse.models) ?? [];
    } catch (restError) {
      console.error('Error fetching Gemini models via REST API:', restError);
      return [];
    }
  }

  private async fetchDeepSeekModels(): Promise<any[]> {
    try {
      const apiUrl = 'https://api.deepseek.com/v1/models';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.settings.apiKeyDeepSeek}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const modelsResponse = await response.json();
      console.log('Fetched DeepSeek models:', modelsResponse);

      // Extract model IDs and return them
      return (
        modelsResponse.data.map((model) => ({
          id: model.id,
          object: model.object,
          created: 0,
          owned_by: 'deepseek',
        })) ?? []
      );
    } catch (error) {
      console.error('Error fetching DeepSeek models:', error);
      return [];
    }
  }

  private async fetchMistralModels(): Promise<any[]> {
    try {
      const mistral = new Mistral({
        apiKey: this.settings.apiKeyMistral,
      });

      const response = await mistral.models.list();
      console.log('Mistral models:', response);

      return (
        response.data.map((model) => ({
          id: model.id,
          object: model.object,
          created: model.created,
          owned_by: model.ownedBy,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching Mistral models:', error);
      return [];
    }
  }

  private async fetchGrokModels(): Promise<any[]> {
    try {
      const apiUrl = 'https://api.x.ai/v1/models';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.settings.apiKeyGrok}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const modelsResponse = await response.json();
      console.log('Fetched Grok models:', modelsResponse);

      // Extract model IDs and return them
      return (
        modelsResponse.data.map((model) => ({
          id: model.id,
          object: model.object,
          created: 0,
          owned_by: 'grok',
        })) ?? []
      );
    } catch (error) {
      console.error('Error fetching Grok models:', error);
      return [];
    }
  }

  private async fetchStepFunModels(): Promise<any[]> {
    try {
      const openai = new OpenAI({
        apiKey: this.settings.apiKeyStepFun,
        baseURL: 'https://api.stepfun.com/v1',
        dangerouslyAllowBrowser: true,
      });

      const response = await openai.models.list();
      console.log('StepFun models:', response);

      return (
        response.data.map((model) => ({
          id: model.id,
          object: model.object,
          created: model.created,
          owned_by: model.owned_by,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching StepFun models:', error);
      return [];
    }
  }

  private getPredefinedModels(): Model[] {
    return [
      {id: 'o4-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o3', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o3-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o1', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'o1-pro', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4.1', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4.1-mini', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4.1-nano', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'gpt-4o', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'chatgpt-4o-latest', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'dall-e-3', object: 'model', created: 0, owned_by: 'openai'},
      {id: 'claude-opus-4-20250514', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-sonnet-4-20250514', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-7-sonnet-latest', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-5-sonnet-latest', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'claude-3-5-haiku-latest', object: 'model', created: 0, owned_by: 'anthropic'},
      {id: 'deepseek-reasoner', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'deepseek-chat', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'deepseek-coder', object: 'model', created: 0, owned_by: 'deepseek'},
      {id: 'gemini-2.5-pro-preview-05-06', object: 'model', created: 0, owned_by: 'gemini'},
      {id: 'gemini-2.5-flash-preview-04-17', object: 'model', created: 0, owned_by: 'gemini'},
      {id: 'gemini-2.0-flash', object: 'model', created: 0, owned_by: 'gemini'},
      {id: 'qwen-max', object: 'model', created: 0, owned_by: 'qwen'},
      {id: 'qwen-plus', object: 'model', created: 0, owned_by: 'qwen'},
      {id: 'qwen-turbo', object: 'model', created: 0, owned_by: 'qwen'},
      {id: 'grok-3-latest', object: 'model', created: 0, owned_by: 'grok'},
      {id: 'grok-3-fast-latest', object: 'model', created: 0, owned_by: 'grok'},
      {id: 'grok-3-mini-latest', object: 'model', created: 0, owned_by: 'grok'},
      {id: 'grok-2-latest', object: 'model', created: 0, owned_by: 'grok'},
      {id: 'grok-beta', object: 'model', created: 0, owned_by: 'grok'},
      {id: 'codestral-latest', object: 'model', created: 0, owned_by: 'mistral'},
      {id: 'mistral-large-latest', object: 'model', created: 0, owned_by: 'mistral'},
      {id: 'mistral-small-latest', object: 'model', created: 0, owned_by: 'mistral'},
      {id: 'step-1', object: 'model', created: 0, owned_by: 'step'},
      {id: 'step-1-flash', object: 'model', created: 0, owned_by: 'step'},
      {id: 'step-2', object: 'model', created: 0, owned_by: 'step'},
      {id: 'step-2-mini', object: 'model', created: 0, owned_by: 'step'},
    ];
  }

  private getOpenAi() {
    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
}
