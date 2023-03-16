import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioComponentComponent } from './audio-component.component';

describe('AudioComponentComponent', () => {
  let component: AudioComponentComponent;
  let fixture: ComponentFixture<AudioComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
