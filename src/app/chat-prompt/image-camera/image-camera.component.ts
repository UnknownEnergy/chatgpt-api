import { Component, output, viewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-image-camera-component',
  standalone: true,
  templateUrl: './image-camera.component.html',
  imports: [MatMenuTrigger, MatMenu],
  styleUrls: ['./image-camera.component.css'],
})
export class ImageCameraComponent {
  readonly imageMenu = viewChild<MatMenuTrigger>('imageMenu');

  imagePreviewChanged = output<string>();

  imagePreview: string;

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
    // Use the browser's camera functionality
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      const main = this;

      async function takePicture() {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
        });

        main.imagePreview = 'data:image/jpeg;base64,' + image.base64String;
        main.imagePreviewChanged.emit(main.imagePreview);
      }

      void takePicture();
    } else if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = document.createElement('video');
          video.srcObject = stream;
          void video.play();

          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            this.imagePreview = canvas.toDataURL('image/jpeg');
            this.imagePreviewChanged.emit(this.imagePreview);

            stream.getTracks().forEach((track) => track.stop());
          }, 1000);
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
    } else {
      console.error('Camera access not supported');
    }
  }
}
