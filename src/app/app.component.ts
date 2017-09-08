import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SQLite } from '@ionic-native/sqlite';
import { SqlService } from '../providers/sql.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public sqlite: SQLite,
    public sqlService: SqlService,
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'AdmSuperPage' },
      { title: 'Preventista', component: 'PreventaPage' },
      { title: 'Auto Venta', component: 'AutoVentaPage' },
      { title: 'Mapa', component: 'InfoMapPage' },
      { title: 'SqlList', component: 'ListUserPage' },
      { title: 'Mapa Prueba', component: 'MapGenericPage' },
      { title: 'Salir', component: 'HomePage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createDatabase();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private createDatabase(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default' // the location field is required
    })
    .then((db) => {
      this.sqlService.setDatabase(db);
      return this.sqlService.createTable();
    })
    .then(() =>{
      this.splashScreen.hide();
      this.rootPage = 'HomePage';
    })
    .catch(error =>{
      console.error(error);
    });
  }
}
