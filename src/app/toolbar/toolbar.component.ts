import { Component, inject, OnInit } from '@angular/core';
import { TipAndCreditsModalComponent } from './tip-and-credits-modal/tip-and-credits-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SavedChatsPanelComponent } from './saved-chats-panel/saved-chats-panel.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { UsageComponent } from './usage/usage.component';
import { SettingsComponent } from './settings/settings.component';
import { ClearMessagesComponent } from './clear-messages/clear-messages.component';
import {ApiKeySettingsComponent} from "./api-key-settings/api-key-settings.component";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [NgClass, UsageComponent, SettingsComponent, ClearMessagesComponent, ApiKeySettingsComponent],
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly overlay = inject(OverlayContainer);

  isChatHeaderCollapsed: any = true;
  isApiSettingsHeaderCollapsed: any = true;
  darkModeEnabled: boolean = false;

  constructor() {
    const savedIsChatHeaderCollapsed = localStorage.getItem('isChatHeaderCollapsed');
    if (savedIsChatHeaderCollapsed) {
      this.isChatHeaderCollapsed = JSON.parse(savedIsChatHeaderCollapsed);
    }
    const apiSettingsHeaderCollapsed = localStorage.getItem('isApiSettingsHeaderCollapsed');
    if (apiSettingsHeaderCollapsed) {
      this.isApiSettingsHeaderCollapsed = JSON.parse(apiSettingsHeaderCollapsed);
    }
    const savedIsDarkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (savedIsDarkModeEnabled) {
      this.darkModeEnabled = JSON.parse(savedIsDarkModeEnabled);
    }

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
      localStorage.setItem('isApiSettingsHeaderCollapsed', JSON.stringify(this.isApiSettingsHeaderCollapsed));
    });
  }

  ngOnInit(): void {
    if (this.isChatHeaderCollapsed) {
      const chatHeader = document.getElementsByClassName('chat-settings')[0];
      chatHeader.classList.toggle('collapsed');
    }
    if (this.isApiSettingsHeaderCollapsed) {
      const chatHeader = document.getElementsByClassName('chat-api-key-settings')[0];
      chatHeader.classList.toggle('collapsed');
    }
    if (this.darkModeEnabled) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('dark');
      this.overlay.getContainerElement().classList.add('matDarkMode');
    }
  }

  toggleSettings() {
    const chatSettingsHeader = document.getElementsByClassName('chat-settings')[0];
    const apiKeySettingsHeader = document.getElementsByClassName('chat-api-key-settings')[0];

    if (this.isChatHeaderCollapsed) {
      // Opening settings: close api key settings if open
      this.isChatHeaderCollapsed = false;
      this.isApiSettingsHeaderCollapsed = true;

      chatSettingsHeader.classList.remove('collapsed');
      apiKeySettingsHeader.classList.add('collapsed');
    } else {
      // Closing settings
      this.isChatHeaderCollapsed = true;
      chatSettingsHeader.classList.add('collapsed');
    }

    localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
    localStorage.setItem('isApiSettingsHeaderCollapsed', JSON.stringify(this.isApiSettingsHeaderCollapsed));
  }

  toggleApiKeySettings() {
    const chatSettingsHeader = document.getElementsByClassName('chat-settings')[0];
    const apiKeySettingsHeader = document.getElementsByClassName('chat-api-key-settings')[0];

    if (this.isApiSettingsHeaderCollapsed) {
      // Opening api key settings: close regular settings if open
      this.isApiSettingsHeaderCollapsed = false;
      this.isChatHeaderCollapsed = true;

      apiKeySettingsHeader.classList.remove('collapsed');
      chatSettingsHeader.classList.add('collapsed');
    } else {
      // Closing api key settings
      this.isApiSettingsHeaderCollapsed = true;
      apiKeySettingsHeader.classList.add('collapsed');
    }

    localStorage.setItem('isApiSettingsHeaderCollapsed', JSON.stringify(this.isApiSettingsHeaderCollapsed));
    localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
  }

  openTipDialog() {
    this.dialog.open(TipAndCreditsModalComponent);
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    const body = document.getElementsByTagName('body')[0];
    if (this.darkModeEnabled) {
      body.classList.add('dark');
      this.overlay.getContainerElement().classList.add('matDarkMode');
    } else {
      body.classList.remove('dark');
      this.overlay.getContainerElement().classList.remove('matDarkMode');
    }
    localStorage.setItem('darkModeEnabled', JSON.stringify(this.darkModeEnabled));
  }

  toggleSavePanel() {
    this.dialog.open(SavedChatsPanelComponent);
  }
}
