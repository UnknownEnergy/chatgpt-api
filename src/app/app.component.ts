import {Component, ElementRef, ViewChild} from '@angular/core';
import {Configuration, OpenAIApi} from "openai";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  messageInput = '';
  messages: { content: string; timestamp: Date; avatar: string; isUser: boolean; }[] = [];
  chatbotTyping = false;
  apikey = '';
  chatHistory = [];
  usedTokens: number = 0;

  @ViewChild('messageContainer', { static: false }) messageContainer: ElementRef;

  constructor() {
    // Retrieve the API key from local storage, if it exists
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      this.apikey = savedApiKey;
    }
  }

  async sendMessage() {
    this.chatHistory.push(this.messageInput);
    const configuration = new Configuration({
      apiKey: this.apikey,
    });
    const openai = new OpenAIApi(configuration);
    // Store the API key in local storage
    localStorage.setItem('apiKey', this.apikey);

    // Add the user's message to the chat
    this.messages.push({
      content: this.messageInput,
      timestamp: new Date(),
      avatar: '<i class="bi bi-person-circle"></i>',
      isUser: true
    });

    // Clear the message input field
    this.messageInput = '';

    // Set the chatbot typing indicator to true
    this.chatbotTyping = true;

    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);

    // Generate a response from the chatbot
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: this.chatHistory.join('\n') + '\n' + this.messages[this.messages.length - 1].content,
      temperature: 0,
      max_tokens: 100,
    });

    // Add the chatbot's response to the chat
    if (response && response.data && response.data.choices && response.data.choices.length > 0) {
      const message = response.data.choices[0].text;
      this.messages.push({
        content: message,
        timestamp: new Date(),
        avatar: '<i class="bi bi-laptop"></i>',
        isUser: false,
      });
      this.chatHistory.push(message);
    }

    // Set the chatbot typing indicator to false
    this.chatbotTyping = false;

    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }, 0);
  }
}
