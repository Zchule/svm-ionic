import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';

import { LoginService } from '../../providers/login.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  lists: any[] = [];
  myDate: String = new Date().toISOString().substring(0, 10);
  progressPercent;
  date = new Date();

  constructor(
    public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public navParams: NavParams,
    public loginService: LoginService,
    public alertCtrl: AlertController

  ) {
    console.log(this.navParams.get('key'));
    this.lists = this.navParams.get('key')
    console.log();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }  

}