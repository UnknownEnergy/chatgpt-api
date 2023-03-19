import {NgModule, isDevMode, APP_INITIALIZER} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { TipModalComponent } from './tip-modal-component/tip-modal.component';
import {InfoModalComponent} from "./info-modal-component/info-modal.component";
import {IntroModalComponent} from "./intro-modal-component/intro-modal.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { ServiceWorkerModule } from '@angular/service-worker';
import { PwaPromptComponent } from './pwa-prompt-component/pwa-prompt.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PwaService} from "./services/pwa.service";
import {InfoComponent} from "./info-component/info.component";
import { AudioComponentComponent } from './audio-component/audio-component.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChatPromptComponentComponent } from './chat-prompt-component/chat-prompt-component.component';
import { HeaderComponent } from './header-component/header.component';
import { UsageComponent } from './usage/usage.component';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    TipModalComponent,
    InfoComponent,
    InfoModalComponent,
    IntroModalComponent,
    PwaPromptComponent,
    AudioComponentComponent,
    ChatPromptComponentComponent,
    HeaderComponent,
    UsageComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    MatBottomSheet,
    {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
