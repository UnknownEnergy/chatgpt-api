import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioComponent } from './audio.component';
import { beforeEach, describe, it } from 'node:test';

describe('AudioComponentComponent', () => {
  let component: AudioComponent;
  let fixture: ComponentFixture<AudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
