import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { PhotoService } from '../services/photo.service';

export interface filePhoto {
  name : string; //filepath
  path : string; //webviewPath
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  urlImageStorage : string[] = [];

  constructor(
    private afStorage : AngularFireStorage,
    public photoService : PhotoService
  ) { }

  async ngOnInit() {
    
  } 
  
  async ionViewDidEnter() {
    await this.photoService.loadPhoto();
    this.showData();
  }

  deletePhoto() {
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.delete().then(() => {
            //show data
            this.showData();
          });
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  showData() {
    this.urlImageStorage=[];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then(url => {
            this.urlImageStorage.unshift(url)
          });
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  uploadPhoto() {
    this.urlImageStorage=[];
    for(var index in this.photoService.dataPhoto) {
      const imgFilepath = `imgStorage/${this.photoService.dataPhoto[index].filePath}`;

      this.afStorage.upload(imgFilepath, this.photoService.dataPhoto[index].dataImage).then(() => {
        this.afStorage.storage.ref().child(imgFilepath).getDownloadURL().then((url) => {
          this.urlImageStorage.unshift(url);
        });
      });
    }
  }

}
