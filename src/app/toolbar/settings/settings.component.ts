import {Component} from '@angular/core';
import OpenAI from "openai";
import {SettingsService} from "../../services/settings.service";
import Model = OpenAI.Model;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showPassword: boolean = false;
  models: Model[] = [];

  constructor(public settings: SettingsService) {
    this.refreshModels();
    this.settings.refreshApiKey.subscribe(() => {
      this.refreshModels();
    });
  }

  refreshModels() {
    const openai = this.getOpenAi();
    openai.models.list().then(response => {
      const importantModels = [
        {
          created: 0,
          id: 'gpt-4-1106-preview',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'gpt-4-1106-vision-preview',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'gpt-3.5-turbo-1106',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'gpt-3.5-turbo',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'gpt-4',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'gpt-4-32k',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'DALL·E·3',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'DALL·E·2',
          object: '',
          owned_by: ''
        },
        {
          created: 0,
          id: 'text-davinci-003',
          object: '',
          owned_by: ''
        }
      ];
      const otherModels = response.data.filter(model => {
        return !importantModels.some(importantModel => importantModel.id === model.id);
      }).sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
      // @ts-ignore
      this.models = [...importantModels, ...otherModels];
    })
  }

  onTypeApiKey() {
    this.refreshModels();
    localStorage.setItem('apiKey', this.settings.apiKey);
    this.settings.refreshApiKey.emit();
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  onInputOnlyAllowPositiveIntegers($event: KeyboardEvent) {
    const charCode = $event.charCode;
    if (charCode < 48 || charCode > 57) {
      $event.preventDefault();
    }
  }

  private getOpenAi() {

    return new OpenAI({
      apiKey: this.settings.apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}
