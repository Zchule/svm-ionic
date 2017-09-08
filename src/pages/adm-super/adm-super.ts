import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-adm-super',
  templateUrl: 'adm-super.html',
})
export class AdmSuperPage {
  
  myDate: String = new Date().toISOString().substring(0, 10);

  constructor(
    public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public alertCtrl: AlertController

  ) {
  }

  ionViewDidLoad() {
    console.log("AdminUser");
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }  

  options(){
  }
}