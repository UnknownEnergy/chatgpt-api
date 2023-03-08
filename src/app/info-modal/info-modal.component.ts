import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import QRCode from 'qrcode';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent {
  @Input() darkModeEnabled: boolean;

  @Output() close = new EventEmitter<void>();

  constructor() {}


  ngOnInit(): void {
    if(this.darkModeEnabled) {
      const container = document.getElementsByClassName('popup-container')[0];
      container.classList.add('dark-mode');
    }
  }
}
