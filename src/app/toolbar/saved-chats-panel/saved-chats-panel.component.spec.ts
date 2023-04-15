import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedChatsPanelComponent } from './saved-chats-panel.component';

describe('SavedChatsPanelComponent', () => {
  let component: SavedChatsPanelComponent;
  let fixture: ComponentFixture<SavedChatsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedChatsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedChatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
