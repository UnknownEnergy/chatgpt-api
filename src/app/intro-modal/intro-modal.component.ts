import { AfterContentChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from '../services/settings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intro-dialog',
  standalone: true,
  templateUrl: './intro-modal.component.html',
  imports: [MatDialogActions, FormsModule, MatDialogContent],
  styleUrls: ['./intro-modal.component.css'],
})
export class IntroModalComponent implements AfterContentChecked {
  apiKey: string;
  @ViewChild('apiKeyInput') apiKeyInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<IntroModalComponent>,
    private readonly settings: SettingsService,
  ) {}

  ngAfterContentChecked() {
    setTimeout(() => {
      this.apiKeyInput.nativeElement.focus();
    }, 0);
  }

  onContinue() {
    this.settings.refreshApiKey.emit();
    this.dialogRef.close({ apiKey: this.apiKey });
  }

  openApiKeyWebsite() {
    window.open('https://platform.openai.com/account/api-keys', '_blank');
  }
}
