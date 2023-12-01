import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-image-camera-component',
  templateUrl: './image-camera.component.html',
  styleUrls: ['./image-camera.component.css']
})
export class ImageCameraComponent {
  @ViewChild('imageMenu') imageMenu: MatMenuTrigger; // Use ViewChild to access the mat-menu
  imagePreview: string;
  @Output() imagePreviewChanged: EventEmitter<string> = new EventEmitter();

  constructor() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.imagePreviewChanged.emit(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }
  }

  openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();

          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            this.imagePreview = canvas.toDataURL('image/jpeg');
            this.imagePreviewChanged.emit(this.imagePreview);

            stream.getTracks().forEach(track => track.stop());
          }, 1000);
        })
        .catch(error => {
          console.error('Error accessing the camera:', error);
        });
    } else {
      console.error('Camera access not supported');
    }
  }
}
