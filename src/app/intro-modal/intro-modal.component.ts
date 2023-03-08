import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-intro-dialog',
  templateUrl: './intro-modal.component.html',
  styleUrls: ['./intro-modal.component.css']
})
export class IntroModalComponent {
  apiKey: string;

  constructor(public dialogRef: MatDialogRef<IntroModalComponent>) {
  }

  onSave() {
    this.dialogRef.close({apiKey: this.apiKey});
  }

  onCancel() {
    this.dialogRef.close();
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }
}
