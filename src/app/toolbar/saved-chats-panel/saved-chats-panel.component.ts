import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-saved-chats-panel',
  templateUrl: './saved-chats-panel.component.html',
  styleUrls: ['./saved-chats-panel.component.css']
})
export class SavedChatsPanelComponent {
  constructor(private dialogRef: MatDialogRef<SavedChatsPanelComponent>) {}

  testList: TestComponent[] = [];
  steps: number;

  ngOnInit(): void {
    let testComponent = new TestComponent();
    testComponent.name = "Test";
    testComponent.description = "Test";

    this.testList.push(testComponent);
    this.testList.push(testComponent);
  }

  saveChat(){

  }

  close(){
    this.dialogRef.close();
  }

  setStep(number: number) {
    this.steps = number;
  }
}

export class TestComponent {
  name: string;
  description: string

}
