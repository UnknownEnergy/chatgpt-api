import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import QRCode from 'qrcode';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent {
  @Input() darkModeEnabled: boolean;

  constructor(public dialogRef: MatDialogRef<InfoModalComponent>) {}

  ngOnInit(): void {
    if(this.darkModeEnabled) {
      const container = document.getElementsByClassName('popup-container')[0];
      container.classList.add('dark-mode');
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
