import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  img: string = "placeholder.png";
  randomNumber: number = Math.floor(Math.random() * 10);
  inputValue: number = 0;
  guessStatus: boolean = false;

  constructor() { }

  checkResult() {
    if(this.inputValue == this.randomNumber) {
      this.guessStatus = true;
      this.img = "My_Photo.png";
    }
  }

}
