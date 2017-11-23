import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController } from 'ionic-angular';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationService } from './../../providers/location';

import { MapService } from '../../providers/map.service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  myDate: String = new Date().toISOString().substring(0, 10);
  fecha: string;
  subscriptions: Subscription[] = [];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private backgroundGeolocation: BackgroundGeolocation,
    private locationProvider: LocationService,
    public alertCtrl: AlertController,
    private mapService: MapService,
  ) {}

  ionViewDidLoad() {
    this.mapService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fecha = data.fecha;
      this.startBackgroundGeolocation();
    });
    
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuSuper');
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  startBackgroundGeolocation() {
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) => {
      if (rta) {
        this.locationProvider.start(this.fecha);
      } else {
        const alert = this.alertCtrl.create({
          title: 'Active su GPS',
          subTitle: 'No se encuentra activado',
          buttons: ['OK']
        });
        alert.present();
        this.backgroundGeolocation.showLocationSettings();
      }
    });
  }

  stopBackgroundGeolocation() {
    this.locationProvider.stop();
  }

}
