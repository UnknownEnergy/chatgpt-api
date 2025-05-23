import { AfterContentChecked, Component, ElementRef, inject, viewChild } from '@angular/core';
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
  private readonly dialogRef = inject(MatDialogRef<IntroModalComponent>);
  private readonly settings = inject(SettingsService);

  readonly apiKeyInput = viewChild.required<ElementRef>('apiKeyInput');

  apiKey: string;

  ngAfterContentChecked() {
    setTimeout(() => {
      this.apiKeyInput().nativeElement.focus();
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
