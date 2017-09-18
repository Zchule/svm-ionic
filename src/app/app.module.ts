import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { VendedorService } from '../providers/vendedor.service';
import { LoginService } from '../providers/login.service';

import { SQLite } from '@ionic-native/sqlite';
import { Sim } from '@ionic-native/sim';

import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

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
    IonicStorageModule.forRoot()
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
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VendedorService,
    LoginService,
    Network
  ]
})
export class AppModule {}
