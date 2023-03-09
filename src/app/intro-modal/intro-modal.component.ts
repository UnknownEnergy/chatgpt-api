import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SwUpdate} from "@angular/service-worker";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-intro-dialog',
  templateUrl: './intro-modal.component.html',
  styleUrls: ['./intro-modal.component.css']
})
export class IntroModalComponent {
  apiKey: string;
  showAddToHomeScreenButton = false;

  constructor(public dialogRef: MatDialogRef<IntroModalComponent>,
              private swUpdate: SwUpdate,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).subscribe(result => {
      this.showAddToHomeScreenButton = result.matches;
    });
  }

  onContinue() {
    this.dialogRef.close({apiKey: this.apiKey});
  }

  openApiKeyWebsite() {
    window.open("https://platform.openai.com/account/api-keys", "_blank");
  }

  promptAddToHomeScreen() {
    const promptEvent = this.swUpdate.available.subscribe(event => {
      const prompt = (event as any).prompt();
      if (prompt) {
        prompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
        });
      }
      promptEvent.unsubscribe();
    });
  }
}
