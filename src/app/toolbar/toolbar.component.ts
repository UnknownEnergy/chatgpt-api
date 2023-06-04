import {Component, HostBinding, OnInit} from '@angular/core';
import {TipAndCreditsModalComponent} from "./tip-and-credits-modal/tip-and-credits-modal.component";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SavedChatsPanelComponent} from "./saved-chats-panel/saved-chats-panel.component";
import {OverlayContainer} from "@angular/cdk/overlay";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isChatHeaderCollapsed: any = true;
  darkModeEnabled: boolean = false;

  constructor(private dialog: MatDialog, private overlay: OverlayContainer) {
    const savedIsChatHeaderCollapsed = localStorage.getItem('isChatHeaderCollapsed');
    if (savedIsChatHeaderCollapsed) {
      this.isChatHeaderCollapsed = JSON.parse(savedIsChatHeaderCollapsed);
    }
    const savedIsDarkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (savedIsDarkModeEnabled) {
      this.darkModeEnabled = JSON.parse(savedIsDarkModeEnabled);
    }

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
    });
  }

  ngOnInit(): void {
    if (this.isChatHeaderCollapsed) {
      const chatHeader = document.getElementsByClassName('chat-settings')[0];
      chatHeader.classList.toggle('collapsed');
    }
    if (this.darkModeEnabled) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('dark');
      this.overlay.getContainerElement().classList.add("matDarkMode");
    }
  }

  toggleSettings() {
    const chatHeader = document.getElementsByClassName('chat-settings')[0];
    chatHeader.classList.toggle('collapsed');
    this.isChatHeaderCollapsed = !this.isChatHeaderCollapsed;
    localStorage.setItem('isChatHeaderCollapsed', JSON.stringify(this.isChatHeaderCollapsed));
  }

  openTipDialog() {
    this.dialog.open(TipAndCreditsModalComponent);
  }

  openInfoDialog() {
    this.dialog.open(InfoModalComponent);
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    const body = document.getElementsByTagName('body')[0];
    if (this.darkModeEnabled) {
      body.classList.add('dark');
      this.overlay.getContainerElement().classList.add("matDarkMode");
    } else {
      body.classList.remove('dark');
      this.overlay.getContainerElement().classList.remove("matDarkMode");
    }
    localStorage.setItem('darkModeEnabled', JSON.stringify(this.darkModeEnabled));
  }

  toggleSavePanel() {
    this.dialog.open(SavedChatsPanelComponent);
    //this.showSavedChatsPanel = !this.showSavedChatsPanel;
  }
}
