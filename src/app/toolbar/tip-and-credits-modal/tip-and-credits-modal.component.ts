import {Component, Input} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import QRCode from 'qrcode';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-tip-and-credits-modal',
  templateUrl: './tip-and-credits-modal.component.html',
  styleUrls: ['./tip-and-credits-modal.component.css']
})
export class TipAndCreditsModalComponent {
  @Input() darkModeEnabled: boolean;

  bitcoinAddress: string = '1Beer4MeHd1ybUeWWKxA6ieYV7xiufQxUE';
  qrCode: string;

  constructor(public dialogRef: MatDialogRef<TipAndCreditsModalComponent>,
              private clipboard: Clipboard) {
  }

  async ngOnInit() {
    this.qrCode = await QRCode.toDataURL(this.bitcoinAddress);

    if (this.darkModeEnabled) {
      const container = document.getElementsByClassName('popup-container')[0];
      container.classList.add('dark-mode');
    }
  }

  copyBitcoinAddress() {
    this.clipboard.copy(this.bitcoinAddress);
  }

  onClose() {
    this.dialogRef.close();
  }

}
