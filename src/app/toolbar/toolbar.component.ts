import {Component, OnInit} from '@angular/core';
import {TipAndCreditsModalComponent} from "./tip-and-credits-modal/tip-and-credits-modal.component";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isChatHeaderCollapsed: any = true;
  darkModeEnabled: boolean = false;

  constructor(private dialog: MatDialog) {
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
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('darkModeEnabled', JSON.stringify(this.darkModeEnabled));
  }
}
