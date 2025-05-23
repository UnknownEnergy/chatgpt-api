import { Platform } from '@angular/cdk/platform';
import { inject, Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take, timer } from 'rxjs';
import { PwaPromptComponent } from '../pwa-prompt/pwa-prompt.component';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly platform = inject(Platform);

  private promptEvent: any;

  public initPwaPrompt() {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.promptEvent = event;
        this.openPromptComponent('android');
      });
    }
    if (this.platform.IOS) {
      const isInStandaloneMode = 'standalone' in window.navigator && window.navigator['standalone'];
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    }
  }

  private openPromptComponent(mobileType: 'ios' | 'android') {
    timer(3000)
      .pipe(take(1))
      .subscribe(() =>
        this.bottomSheet.open(PwaPromptComponent, {
          data: {
            mobileType,
            promptEvent: this.promptEvent,
          },
        }),
      );
  }
}
