import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DataService } from '../providers/data.service';

import { SQLite } from '@ionic-native/sqlite';
import { SqlService } from '../providers/sql.service';

const configFirebase ={
  apiKey: "AIzaSyCHkCq2n-zXmNHb5BpfrMKz6qSGBhUkSOw",
  authDomain: "dmimovil-f7e74.firebaseapp.com",
  databaseURL: "https://dmimovil-f7e74.firebaseio.com",
  projectId: "dmimovil-f7e74",
  storageBucket: "dmimovil-f7e74.appspot.com",
  messagingSenderId: "595861180440"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp( configFirebase ),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataService,
    SqlService
  ]
})
export class AppModule {}
