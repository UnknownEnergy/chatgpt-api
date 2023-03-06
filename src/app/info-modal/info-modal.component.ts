import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import QRCode from 'qrcode';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent {
  @Output() close = new EventEmitter<void>();

  constructor() {}
}
