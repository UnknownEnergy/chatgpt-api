import {Component} from '@angular/core';
import {Configuration, Model, OpenAIApi} from "openai";
import {SettingsService} from "../../services/settings.service";

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
    openai.listModels().then(response => {
      const importantModels = [
        {
          created: 0,
          id: 'gpt-4',
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
          id: 'DALL·E',
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
      const otherModels = response.data.data.filter(model => {
        return !importantModels.some(importantModel => importantModel.id === model.id);
      }).sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
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
    const configuration = new Configuration({
      apiKey: this.settings.apiKey,
    });
    return new OpenAIApi(configuration);
  }
}
