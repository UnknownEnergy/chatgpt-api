import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

// Your service and initializer
import { PwaService } from './app/services/pwa.service';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ),
    { provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true },
    // any other services like MatBottomSheet
  ],
});
