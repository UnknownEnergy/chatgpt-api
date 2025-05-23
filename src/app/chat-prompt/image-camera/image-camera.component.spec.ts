import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCameraComponent } from './image-camera.component';
import { beforeEach, describe, it } from 'node:test';

describe('ImageCameraComponentComponent', () => {
  let component: ImageCameraComponent;
  let fixture: ComponentFixture<ImageCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCameraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
