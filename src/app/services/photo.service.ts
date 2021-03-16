import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public dataPhoto: Photo[] = [];
  private keyPhoto: string = "photo";
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addPhoto() {
    const Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    console.log(Photo);

    this.dataPhoto.unshift({
      filePath: "Load",
      webviewPath: Photo.webPath
    });

    Storage.set({
      key: this.keyPhoto,
      value: JSON.stringify(this.dataPhoto)
    });
  }

  public async savePhoto(photo: CameraPhoto) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime + '.jpeg';
    const saveFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if(this.platform.is('hybrid')) {
      return {
        filePath : saveFile.uri,
        webviewPath : Capacitor.convertFileSrc(saveFile.uri)
      }
    } else {
      return {
        filePath: fileName,
        webviewPath: photo.webPath
      }
    }
  }

  private async readAsBase64(photo: CameraPhoto) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadPhoto() {
    const listPhoto = await Storage.get({ key: this.keyPhoto });
    this.dataPhoto = JSON.parse(listPhoto.value) || [];

    if(!this.platform.is('hybrid')) {
      for (let photo of this.dataPhoto) {
        const readFile = await Filesystem.readFile({
          path: photo.filePath,
          directory: FilesystemDirectory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }

    console.log(this.dataPhoto);
  }
}

export interface Photo {
  filePath: string;
  webviewPath: string;
}
