import { Component } from '@angular/core';

@Component({
  selector: 'app-clear-messages',
  templateUrl: './clear-messages.component.html',
  styleUrls: ['./clear-messages.component.css'],
})
export class ClearMessagesComponent {
  clearMessages() {
    window.location.reload();
  }
}
