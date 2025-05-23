import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-pwa-prompt',
  templateUrl: './pwa-prompt.component.html',
  styleUrls: ['./pwa-prompt.component.css'],
})
export class PwaPromptComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef<PwaPromptComponent>);
  public readonly data = inject<{ mobileType: 'ios' | 'android'; promptEvent?: any }>(
    MAT_BOTTOM_SHEET_DATA,
  );

  public installPwa(): void {
    this.data.promptEvent.prompt();
    this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
  }
}
