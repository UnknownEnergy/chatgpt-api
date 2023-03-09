import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PwaService} from "../services/pwa.service";

@Component({
  selector: 'app-intro-dialog',
  templateUrl: './intro-modal.component.html',
  styleUrls: ['./intro-modal.component.css']
})
export class IntroModalComponent {
  apiKey: string;

  constructor(public dialogRef: MatDialogRef<IntroModalComponent>, pwaService: PwaService) {
    pwaService.initPwaPrompt();
  }

  onContinue() {
    this.dialogRef.close({apiKey: this.apiKey});
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }
}
