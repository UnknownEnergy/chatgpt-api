import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-usage',
  standalone: true,
  templateUrl: './usage.component.html',
  imports: [MatMenuTrigger, MatMenu],
  styleUrls: ['./usage.component.css'],
})
export class UsageComponent {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(SettingsService);
  total_granted: number = 0;
  total_used: number = 0;
  protected readonly open = open;

  constructor() {
    this.settings.refreshApiKey.subscribe(() => {
      // this.refreshCredits();
    });
  }

  // INFO: for free credits activate this:
  // refreshCredits() {
  //   const url = 'https://api.openai.com/dashboard/billing/credit_grants';
  //   const options = {
  //     headers: {
  //       "authorization": "Bearer " + this.settings.apiKey,
  //     },
  //   };
  //   this.http.get(url, options).subscribe((data: any) => {
  //     this.total_granted = data.total_granted;
  //     this.total_used = data.total_used;
  //   });
  // }

  private static convertDateToString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  refreshCredits() {
    this.getTotalUsageUSD();
    this.getHardLimitUSD();
  }

  getTotalUsageUSD() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const url = `https://api.openai.com/dashboard/billing/usage?start_date=${UsageComponent.convertDateToString(firstDayOfMonth)}&end_date=${UsageComponent.convertDateToString(firstDayOfNextMonth)}`;
    const options = {
      headers: {
        authorization: 'Bearer ' + this.settings.apiKey,
      },
    };
    this.http.get(url, options).subscribe((response: any) => {
      this.total_used = response.total_usage / 100;
    });
  }

  getHardLimitUSD() {
    const url = 'https://api.openai.com/dashboard/billing/subscription';
    const options = {
      headers: {
        authorization: 'Bearer ' + this.settings.apiKey,
      },
    };
    this.http.get(url, options).subscribe((response: any) => {
      this.total_granted = response.hard_limit_usd;
    });
  }

  openOpenAIWebsite() {
    window.open('https://platform.openai.com/account/usage', '_blank');
  }

  openAnthropicWebsite() {
    window.open('https://console.anthropic.com/settings/usage', '_blank');
  }

  openGeminiWebsite() {
    window.open('https://console.cloud.google.com/apis/dashboard', '_blank');
  }

  openDeepSeekWebsite() {
    window.open('https://platform.deepseek.com/usage', '_blank');
  }

  openQwenWebsite() {
    window.open('https://bailian.console.alibabacloud.com/#/data-analysis', '_blank');
  }

  openGrokWebsite() {
    window.open('https://console.x.ai/', '_blank');
  }

  openMistralWebsite() {
    window.open('https://console.mistral.ai/usage/', '_blank');
  }

  openStepFunWebsite() {
    window.open('https://platform.stepfun.com/account-overview', '_blank');
  }
}
