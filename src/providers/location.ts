import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocationService {

  rutasListRef: AngularFireList<any>;
  today = new Date();
  imeiSuper: string;

  constructor(
    private fireDatabase: AngularFireDatabase,
    private backgroundGeolocation: BackgroundGeolocation,
    private storage: Storage
  ) {
    console.log('Hello LocationProvider Provider');
    this.storage.get('imei')
    .then(imei => {
      this.imeiSuper = imei;
    });
  }

  savePositionActual(latitude, longitude) {
    console.log('save position');
    const position = this.fireDatabase.object(`trackingSupervisor/${this.imeiSuper}/PosicionActual`);
    position.set({
        hora: `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`,
        latitud: latitude,
        longitud: longitude
    });
  }

  updatePositionActual(latitude, longitude) {
    console.log('update position');
    const position = this.fireDatabase.object(`trackingSupervisor/${this.imeiSuper}/PosicionActual`);
    position.update({
        hora: `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`,
        latitud: latitude,
        longitud: longitude
    });
  }

  saveGeoPuntoList(fecha, latitude, longitude) {
    const geoPuntoListRef = this.fireDatabase.list(`/trackingSupervisor/${this.imeiSuper}/registro:${fecha}/geoPuntoList`);
    geoPuntoListRef.push({
      hora: `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`,
      latitud: latitude,
      longitud: longitude,
      });
  }

  start(fecha) {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 5,
      distanceFilter: 5,
      debug: false,
      stopOnTerminate: false,
      locationProvider: 1,
      startForeground: true,
      interval: 300000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      // notificationTitle: 'Background tracking',
      // notificationText: 'enabled',
      // notificationIconColor: '#FEDD1E',
      // notificationIconLarge: 'mappointer_large',
      // notificationIconSmall: 'mappointer_small'
    };

    this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log('ubic', location);
        this.saveGeoPuntoList(fecha, location.latitude, location.longitude);
        let a = 0;
        if (a === 0) {
          this.savePositionActual(location.latitude, location.longitude);
          a = a + 1;
          console.log(a);
        } else {
          this.updatePositionActual(location.latitude, location.longitude);
          console.log(a);
        }
        this.backgroundGeolocation.getLogEntries(100)
          .then((errors) => {
            console.error(errors);
          });
      });
    this.backgroundGeolocation.start();
  }

  stop() {
    this.backgroundGeolocation.stop();
  }

}
