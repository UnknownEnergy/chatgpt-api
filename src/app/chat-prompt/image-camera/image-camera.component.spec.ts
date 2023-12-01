import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCameraComponent } from './image-camera.component';

describe('ImageCameraComponentComponent', () => {
  let component: ImageCameraComponent;
  let fixture: ComponentFixture<ImageCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCameraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
