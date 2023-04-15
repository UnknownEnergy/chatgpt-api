import {Component, HostListener} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../services/message.service";
import {HighlightService} from "../../services/highlight.service";
import {ChatCompletionRequestMessage} from "openai/dist/api";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-saved-chats-panel',
  templateUrl: './saved-chats-panel.component.html',
  styleUrls: ['./saved-chats-panel.component.css']
})
export class SavedChatsPanelComponent {
  constructor(private dialogRef: MatDialogRef<SavedChatsPanelComponent>, private messageService: MessageService, private highlightService: HighlightService) {
  }

  steps: number;
  messageHistory: Chat[] = [];
  messageHistoryPaginated: Chat[] = [];
  chatSelected: boolean = false;
  aboutToDelete: boolean = false;
  chatName: string = "";
  currentLoadedChatName: string = "";
  containerHeight: string = '400px';


  ngOnInit(): void {
    if (localStorage.getItem('chatHistory') === null) {
      this.messageHistory = [];
    } else {
      this.messageHistory = JSON.parse(localStorage.getItem('chatHistory'));
      console.log(JSON.parse(localStorage.getItem('chatHistory')));

      this.containerHeight = this.calculateAccordionHeight();
    }
    if (this.messageService.currentChatName.length > 0) {
      this.currentLoadedChatName = this.messageService.currentChatName;
      this.chatName = this.messageService.currentChatName;
    }


  }

  calculateAccordionHeight(): string {
    const height = window.innerHeight;
    const breakpoints = [800, 900, 1050, 1200, 1300];
    const values = ['150px', '200px', '250px', '300px', '350px', '450px'];

    let index = 0;
    while (index < breakpoints.length && height > breakpoints[index]) {
      index++;
    }

    return values[index];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    console.log(window.innerHeight);
    this.containerHeight = this.calculateAccordionHeight();
  }

  saveChat() {
    if (this.messageService.messages.length === 0) {
      alert("You can't save an empty chat!");
      return;
    }
    let chat: Chat = new Chat();

    const chatExists: Chat = this.messageHistory.find(c => c.name === this.chatName);
    if (chatExists) chat = chatExists;

    chat.name = this.chatName;
    chat.messages = this.messageService.messages;
    chat.chatHistory = this.messageService.chatHistory;
    chat.createdOnDate = new Date().toLocaleString();
    if (chatExists) {
      this.messageHistory[this.messageHistory.indexOf(chatExists)] = chat;
    } else this.messageHistory.push(chat);
    localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  setStep(number: number) {
    this.steps = number;
  }

  loadChat(chat: Chat, override: boolean) {
    if (this.messageService.messages.length > 0 && !override) {
      this.chatSelected = true;
      return;
    }

    this.messageService.currentChatName = chat.name;
    this.messageService.messages = chat.messages;
    this.messageService.chatHistory = chat.chatHistory;
    this.highlightService.highlightAll();
    this.dialogRef.close();
  }

  cancelLoadChat() {
    this.chatSelected = false;
  }

  deleteChat(chat: Chat) {
    this.aboutToDelete = false;
    this.messageHistory = this.messageHistory.filter(c => c !== chat);
    localStorage.setItem('chatHistory', JSON.stringify(this.messageHistory));
  }
}

export class Chat {
  name: string;
  createdOnDate: string;
  messages: { content: string; contentRaw: string; isRaw?: boolean; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatHistory: ChatCompletionRequestMessage[] = [];

}
