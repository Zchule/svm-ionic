import { Injectable } from '@angular/core';

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

@Injectable()
export class LocationService {

  constructor(
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    console.log('Hello LocationProvider Provider');
  }

  start() {
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
      console.log(location);
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
