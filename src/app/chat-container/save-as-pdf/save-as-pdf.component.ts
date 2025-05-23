import { Component } from '@angular/core';

@Component({
  selector: 'app-save-as-pdf',
  templateUrl: './save-as-pdf.component.html',
  styleUrls: ['./save-as-pdf.component.css'],
})
export class SaveAsPdfComponent {
  public saveAsPdf(): void {
    window.print();
    //the actual styling is in the main styles.scss for pdfs!
  }
}
