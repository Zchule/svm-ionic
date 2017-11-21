import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationService } from './../../providers/location';

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
    public menuCtrl: MenuController,
    private backgroundGeolocation: BackgroundGeolocation,
    private locationProvider: LocationService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeJefeVentasPage');
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'menuSuper');
    this.menuCtrl.enable(true, 'menuJefe');
  }

  startBackgroundGeolocation() {
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) => {
      if (rta) {
        this.locationProvider.start();
      } else {
        this.backgroundGeolocation.showLocationSettings();
      }
    });
  }

  stopBackgroundGeolocation() {
    this.locationProvider.stop();
  }

}
