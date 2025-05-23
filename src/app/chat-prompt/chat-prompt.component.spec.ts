import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPromptComponent } from './chat-prompt.component';
import { beforeEach, describe, it } from 'node:test';

describe('ChatPromptComponentComponent', () => {
  let component: ChatPromptComponent;
  let fixture: ComponentFixture<ChatPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
