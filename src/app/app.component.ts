import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SQLite } from '@ionic-native/sqlite';
import { SqlService } from '../providers/sql.service';
import { LoginService } from '../providers/login.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navMaster: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public sqlite: SQLite,
    public sqlService: SqlService,
    private auth: LoginService,
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: 'HomePage' },
      { title: 'Vendedores', component: 'PreventaPage' },
      { title: 'Mapa', component: 'InfoMapPage' },
      { title: 'SqlList', component: 'ListUserPage' },
      { title: 'Mapa Prueba', component: 'MapGenericPage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.checkSession();
      this.splashScreen.hide();
      this.createDatabase();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navMaster.setRoot(page.component);
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

  logout() {
    this.auth.logout();
    this.navMaster.setRoot('LoginPage');
  }

  private checkSession(){
    if(this.auth.isLoggedIn()){
      this.navMaster.setRoot('HomePage');
    }else{
      this.navMaster.setRoot('LoginPage');
    }
    this.splashScreen.hide();
  }

}
