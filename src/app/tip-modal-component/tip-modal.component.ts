import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import QRCode from 'qrcode';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-tip-modal',
  templateUrl: './tip-modal.component.html',
  styleUrls: ['./tip-modal.component.css']
})
export class TipModalComponent {
  @Input() darkModeEnabled: boolean;

  bitcoinAddress: string = '1Beer4MeHd1ybUeWWKxA6ieYV7xiufQxUE';
  qrCode: string;

  constructor(public dialogRef: MatDialogRef<TipModalComponent>,
              private clipboard: Clipboard) {
  }

  onClose() {
    this.dialogRef.close();
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  copyBitcoinAddress() {
    this.clipboard.copy(this.bitcoinAddress);
  }

  async ngOnInit() {
    this.qrCode = await QRCode.toDataURL(this.bitcoinAddress);

    if (this.darkModeEnabled) {
      const container = document.getElementsByClassName('popup-container')[0];
      container.classList.add('dark-mode');
    }
  }

}
