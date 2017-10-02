import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginService } from '../providers/login.service';

import { Sim } from '@ionic-native/sim';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navMaster: Nav;

  rootPage: any = 'LoginPage';
  user: any = {};
  currentPage = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private sim: Sim,
    private storage: Storage,
    public loginService: LoginService
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: 'HomePage' },
      { title: 'Vendedores', component: 'PreventaPage' },
      { title: 'Mapa', component: 'MapGenericPage' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.obtenerImei();
      this.suscribirCanal();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if ( page.component !== this.currentPage ) {
      this.currentPage = page.component;
      this.navMaster.setRoot(page.component);
    }
  }

  private obtenerImei() {
    console.log('obtenerImei');
    if (this.platform.is('cordova')) { // is native
      this.sim.getSimInfo().then( info => {
        const imei = info.deviceId;
        console.log('native: imei celular', imei);
        // const imei = '356057074214651';
        this.storage.set('imei', imei );
      });
    }else { // is WEB NO TENEMOS SIM EN UN PC
      const imei = '356057074214651';
      console.log('web: imei celular', imei);
      this.storage.set('imei', imei );
    }
  }

  private suscribirCanal() {
    this.loginService.getUserChannel()
    .subscribe(data => {
      this.user = data;
    });
  }

  logout() {
    this.navMaster.setRoot('LoginPage');
    // this.storage.clear();
  }
}
