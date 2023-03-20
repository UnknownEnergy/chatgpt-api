import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaPromptComponent } from './pwa-prompt.component';

describe('PromptComponent', () => {
  let component: PwaPromptComponent;
  let fixture: ComponentFixture<PwaPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwaPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwaPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
