import {NgModule, isDevMode, APP_INITIALIZER} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { TipModalComponent } from './tip-modal/tip-modal.component';
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {IntroModalComponent} from "./intro-modal/intro-modal.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { ServiceWorkerModule } from '@angular/service-worker';
import { PromptComponent } from './prompt-component/prompt.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PwaService} from "./services/pwa.service";
import {InfoComponent} from "./info/info.component";

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    TipModalComponent,
    InfoComponent,
    InfoModalComponent,
    IntroModalComponent,
    PromptComponent
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
  ],
  providers: [
    MatBottomSheet,
    {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
