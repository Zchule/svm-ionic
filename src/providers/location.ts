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

  savePositionActual(latitud, longitud) {
    const position = this.fireDatabase.object(`trackingSupervisor/${this.imeiSuper}`);
    position.set({
      PosicionActual: {
        hora: `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getMinutes()}`,
        latitude: latitud,
        longitude: longitud,
      }
    });
  }

  saveGeoPuntoList(fecha, latitud, longitud) {
    const geoPuntoListRef = this.fireDatabase.object(`/trackingSupervisor/${this.imeiSuper}/registro:${fecha}/geoPuntoList`);
    geoPuntoListRef.set({
      '`registro:${fecha}`': {
        fecha: fecha,
        geoPuntoList: [
          {
            hora: `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getMinutes()}`,
            latitude: latitud,
            longitude: longitud,
          }
        ]
      }
    });
  }

  start(fecha) {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: true,
      stopOnTerminate: false,
      locationProvider: 1,
      startForeground: true,
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small'
    };

    this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log('ubic', location);
        console.log('ubic latitude', location.latitude, location.longitude);
        this.saveGeoPuntoList(fecha, location.latitude, location.longitude);
        this.savePositionActual(location.latitude, location.longitude);
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
