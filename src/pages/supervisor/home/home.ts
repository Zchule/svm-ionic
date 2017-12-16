import { Component } from '@angular/core';
import { IonicPage, MenuController, AlertController } from 'ionic-angular';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationService } from './../../../providers/location';

import { MapService } from '../../../providers/map.service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  date = new Date();
  fecha: string = (this.date.getMonth() + 1) + '-' + this.date.getDate() + '-' + this.date.getFullYear();
  myDate: String = new Date().toISOString().substring(0, 10);
  fechaServidor: string;
  subscriptions: Subscription[] = [];

  constructor(
    private  menuCtrl: MenuController,
    private backgroundGeolocation: BackgroundGeolocation,
    private locationProvider: LocationService,
    private  alertCtrl: AlertController,
    private mapService: MapService
  ) {}

  ionViewDidLoad() {
    console.log('fecha', this.fecha);
    this.mapService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fechaServidor = data.fecha;
      if (this.fechaServidor === this.fecha) {
        console.log('true');
        this.startBackgroundGeolocation();
      } else {
        this.startBackgroundGeolocation();
      }
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
