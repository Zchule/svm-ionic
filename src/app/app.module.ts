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
import { AngularFireOfflineModule } from 'angularfire2-offline';

import { DataService } from '../providers/data.service';
import { SQLite } from '@ionic-native/sqlite';
import { SqlService } from '../providers/sql.service';
import { LoginService } from '../providers/login.service';

var configFirebase = {
  apiKey: "AIzaSyAJDgpY9ssAyjIX_vA7S1D_fgcA26BBvxQ",
  authDomain: "svmmoviltest.firebaseapp.com",
  databaseURL: "https://svmmoviltest.firebaseio.com",
  projectId: "svmmoviltest",
  storageBucket: "svmmoviltest.appspot.com",
  messagingSenderId: "1094384829553"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp( configFirebase ),
    AngularFireDatabaseModule,
    AngularFireOfflineModule
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
    SqlService,
    LoginService
  ]
})
export class AppModule {}
