import {AfterContentChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SettingsService} from "../services/settings.service";

@Component({
  selector: 'app-intro-dialog',
  templateUrl: './intro-modal.component.html',
  styleUrls: ['./intro-modal.component.css']
})
export class IntroModalComponent implements AfterContentChecked {
  apiKey: string;

  constructor(public dialogRef: MatDialogRef<IntroModalComponent>,
              private settings: SettingsService) {
  }

  @ViewChild('apiKeyInput') apiKeyInput: ElementRef;

  ngAfterContentChecked() {
    setTimeout(() => {
      this.apiKeyInput.nativeElement.focus();
    }, 0);
  }

  onContinue() {
    this.settings.refreshApiKey.emit();
    this.dialogRef.close({apiKey: this.apiKey});
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }
}
