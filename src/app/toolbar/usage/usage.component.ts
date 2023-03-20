import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements AfterViewInit{
  @Input() apiKey: string;
  @Input() refreshUsage = new EventEmitter<string>();
  total_granted: number = 0;
  total_used: number = 0;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.refreshUsage.subscribe(() => {
      this.refreshCredits();
    });
    setInterval(this.refreshCredits, 300000);
  }

  refreshCredits() {
    const url = 'https://api.openai.com/dashboard/billing/credit_grants';
    const options = {
      headers: {
        "authorization": "Bearer " + this.apiKey,
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
