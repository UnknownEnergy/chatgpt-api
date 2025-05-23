import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContainerComponent } from './chat-container.component';
import { beforeEach, describe, it } from 'node:test';

describe('ChatContainerComponent', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
