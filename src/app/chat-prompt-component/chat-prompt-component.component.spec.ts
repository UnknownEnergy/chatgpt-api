import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPromptComponentComponent } from './chat-prompt-component.component';

describe('ChatPromptComponentComponent', () => {
  let component: ChatPromptComponentComponent;
  let fixture: ComponentFixture<ChatPromptComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPromptComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPromptComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
