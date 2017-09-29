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
    this.navMaster.setRoot(page.component);
  }

  private obtenerImei() {
    if(this.platform.is('cordova')){
      this.sim.getSimInfo().then( info => {
        console.log(info);
        console.log("imei celular", info);
        let imei = info.deviceId;
        // const imei = '356057074214651';
        this.storage.set('imei', imei );
      })
    }else{
      this.sim.getSimInfo().then( info => {
        let imei = info.deviceId;
        // const imei = '356057074214651';
        this.storage.set('imei', imei );
      })
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
