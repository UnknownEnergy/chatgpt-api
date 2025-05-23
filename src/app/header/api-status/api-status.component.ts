import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-api-status',
  standalone: true,
  templateUrl: './api-status.component.html',
  imports: [NgClass],
  styleUrls: ['./api-status.component.css'],
})
export class ApiStatusComponent implements OnInit {
  statusCode: number;

  ngOnInit() {
    this.refreshStatus();
    setInterval(
      () => {
        this.refreshStatus();
      },
      5 * 60 * 1000,
    ); // refresh every 5 minutes
  }

  async getAPIStatusCode() {
    const response = await fetch('https://status.openai.com/api/v2/components.json');
    const data = await response.json();
    const apiComponent = data.components.find((component) => component.name === 'API');
    if (apiComponent) {
      const status = apiComponent.status;
      switch (status) {
        case 'operational':
          return 3;
        case 'degraded_performance':
          return 2;
        case 'partial_outage':
          return 1;
        case 'major_outage':
          return 0;
      }
    } else {
      throw new Error('API component not found');
    }
    return 0;
  }

  refreshStatus() {
    this.getAPIStatusCode().then((statusCode) => {
      this.statusCode = statusCode;
    });
  }

  openStatusPage() {
    window.open('https://status.openai.com/', '_blank');
  }
}
