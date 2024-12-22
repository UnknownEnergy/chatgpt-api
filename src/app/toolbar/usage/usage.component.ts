import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements AfterViewInit {
  total_granted: number = 0;
  total_used: number = 0;

  constructor(private http: HttpClient,
              private settings: SettingsService) {
    this.settings.refreshApiKey.subscribe(() => {
      // this.refreshCredits();
    });
  }

  ngAfterViewInit(): void {
    // this.refreshCredits();
    // setInterval(this.refreshCredits, 300000);
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
        "authorization": "Bearer " + this.settings.apiKey,
      },
    };
    this.http.get(url, options).subscribe((response: any) => {
      this.total_used = response.total_usage / 100;
    });
  }

  private static convertDateToString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getHardLimitUSD() {
    const url = 'https://api.openai.com/dashboard/billing/subscription';
    const options = {
      headers: {
        "authorization": "Bearer " + this.settings.apiKey,
      },
    };
    this.http.get(url, options).subscribe((response: any) => {
      this.total_granted = response.hard_limit_usd;
    });
  }

  openOpenAIWebsite() {
    window.open("https://platform.openai.com/account/usage", "_blank");
  }

  openAnthropicWebsite() {
    window.open("https://console.anthropic.com/settings/usage", "_blank");
  }

  openGeminiWebsite() {
    window.open("https://console.cloud.google.com/apis/dashboard", "_blank");
  }
}
