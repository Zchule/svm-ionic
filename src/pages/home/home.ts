import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  
  myDate: String = new Date().toISOString().substring(0, 10);

  constructor(
    public navCtrl: NavController, 
    public menuCtrl: MenuController

  ) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }  
}