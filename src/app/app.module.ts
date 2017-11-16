import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SQLite } from '@ionic-native/sqlite';
import { Sim } from '@ionic-native/sim';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { VendedorService } from '../providers/vendedor.service';
import { LoginService } from '../providers/login.service';
import { MapGenericService} from '../providers/map-generic.service';
import { MapService } from '../providers/map.service';

const configFirebase = {
  apiKey: 'AIzaSyAJDgpY9ssAyjIX_vA7S1D_fgcA26BBvxQ',
  authDomain: 'svmmoviltest.firebaseapp.com',
  databaseURL: 'https://svmmoviltest.firebaseio.com',
  projectId: 'svmmoviltest',
  storageBucket: 'svmmoviltest.appspot.com',
  messagingSenderId: '1094384829553'
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp( configFirebase ),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Sim,
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VendedorService,
    LoginService,
    Network,
    MapGenericService,
    MapService
  ]
})
export class AppModule {}
