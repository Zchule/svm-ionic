import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
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

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private sim: Sim,
    private storage: Storage,
    private alertCtrl: AlertController,
    public loginService: LoginService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {
        title: 'Inicio',
        icon: 'md-home',
        component: 'HomePage'
      },
      {
        title: 'Vendedores',
        icon: 'md-list-box', 
        component: 'PreventaPage'
      },
      {
        title: 'Mapa',
        icon: 'map',
        component: 'MapGenericPage'
      },
      {
        title: 'Supervisores',
        icon: 'md-list-box',
        component: 'ListSupervidoresPage'
      }
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
    if (page.component !== this.currentPage) {
      this.currentPage = page.component;
      this.navMaster.setRoot(page.component);
    }
  }

  private obtenerImei() {
    console.log('obtenerImei');
    if (this.platform.is('cordova')) { // is native
      this.sim.getSimInfo().then(info => {
        const imei = info.deviceId;
        console.log('native: imei celular', imei);
        // const imei = '354152087178696';
        this.storage.set('imei', imei);
      });
      this.sim.requestReadPermission().then((permiso) => {
        console.log('Permission granted', permiso);
        const si = permiso.$apply();
      },
        (error) => console.log('Permission denied')
      );

    } else { // is WEB NO TENEMOS SIM EN UN PC
      const imei = '356811079170460';
      console.log('web: imei celular', imei);
      this.storage.set('imei', imei);
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
  }
}
