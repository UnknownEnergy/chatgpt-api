import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearMessagesComponent } from './clear-messages.component';

describe('ClearMessagesComponent', () => {
  let component: ClearMessagesComponent;
  let fixture: ComponentFixture<ClearMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
