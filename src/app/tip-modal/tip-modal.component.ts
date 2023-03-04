import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import QRCode from 'qrcode';

@Component({
  selector: 'app-tip-modal',
  templateUrl: './tip-modal.component.html',
  styleUrls: ['./tip-modal.component.css']
})
export class TipModalComponent {
  bitcoinAddress: string = '1Beer4MeHd1ybUeWWKxA6ieYV7xiufQxUE';
  qrCode: string;
  @Output() close = new EventEmitter<void>();

  constructor(private clipboard: Clipboard) {}

  copyBitcoinAddress() {
    this.clipboard.copy(this.bitcoinAddress);
  }

  async ngOnInit() {
    this.qrCode = await QRCode.toDataURL(this.bitcoinAddress)
  }

}
