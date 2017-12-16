import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-jefe-ventas',
  templateUrl: 'home-jefe-ventas.html',
})
export class HomeJefeVentasPage {

  myDate: String = new Date().toISOString().substring(0, 10);

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeJefeVentasPage');
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'menuSuper');
    this.menuCtrl.enable(true, 'menuJefe');
  }
    
}
