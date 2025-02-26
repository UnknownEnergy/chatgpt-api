import {APP_INITIALIZER, isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {TipAndCreditsModalComponent} from './toolbar/tip-and-credits-modal/tip-and-credits-modal.component';
import {IntroModalComponent} from "./intro-modal/intro-modal.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ServiceWorkerModule} from '@angular/service-worker';
import {PwaPromptComponent} from './pwa-prompt/pwa-prompt.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PwaService} from "./services/pwa.service";
import {InfoComponent} from "./info-text/info.component";
import {AudioComponent} from './chat-prompt/audio/audio.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SavedChatsPanelComponent} from './toolbar/saved-chats-panel/saved-chats-panel.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ChatPromptComponent} from './chat-prompt/chat-prompt.component';
import {HeaderComponent} from './header/header.component';
import {UsageComponent} from './toolbar/usage/usage.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {SettingsComponent} from './toolbar/settings/settings.component';
import {ChatContainerComponent} from './chat-container/chat-container.component';
import {ApiStatusComponent} from './header/api-status/api-status.component';
import {SaveAsPdfComponent} from './chat-container/save-as-pdf/save-as-pdf.component';
import {ClearMessagesComponent} from './toolbar/clear-messages/clear-messages.component';
import {ImageCameraComponent} from "./chat-prompt/image-camera/image-camera.component";

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    TipAndCreditsModalComponent,
    InfoComponent,
    IntroModalComponent,
    PwaPromptComponent,
    AudioComponent,
    ImageCameraComponent,
    ChatPromptComponent,
    HeaderComponent,
    UsageComponent,
    ToolbarComponent,
    SettingsComponent,
    ChatContainerComponent,
    ApiStatusComponent,
    SaveAsPdfComponent,
    ClearMessagesComponent,
    SavedChatsPanelComponent
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
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  providers: [
    MatBottomSheet,
    {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
