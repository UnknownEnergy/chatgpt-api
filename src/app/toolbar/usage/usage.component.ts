import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements AfterViewInit{
  total_granted: number = 0;
  total_used: number = 0;

  constructor(private http: HttpClient,
              private settings: SettingsService) {
    this.settings.refreshApiKey.subscribe(() => {
      this.refreshCredits();
    });
  }

  ngAfterViewInit(): void {
    this.refreshCredits();
    setInterval(this.refreshCredits, 300000);
  }

  refreshCredits() {
    const url = 'https://api.openai.com/dashboard/billing/credit_grants';
    const options = {
      headers: {
        "authorization": "Bearer " + this.settings.apiKey,
      },
    };
    this.http.get(url, options).subscribe((data: any) => {
      this.total_granted = data.total_granted;
      this.total_used = data.total_used;
    });
  }

  openUsageWebsite() {
    window.open("https://platform.openai.com/account/usage", "_blank");
  }
}
