import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { TipModalComponent } from './tip-modal/tip-modal.component';
import {InfoModalComponent} from "./info-modal/info-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    TipModalComponent,
    InfoModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
