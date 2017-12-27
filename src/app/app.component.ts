import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
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

  // used for an example of ngFor and navigation
  pagesSuper: any[] = [
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
      title: 'Mapa Vendedores',
      icon: 'map',
      component: 'MapGenericPage'
    }
  ];

pagesJefe: any[] = [
  {
    title: 'Inicio',
    icon: 'md-home',
    component: 'HomeJefeVentasPage'
  },
  {
    title: 'Supervisores',
    icon: 'md-list-box',
    component: 'ListSupervidoresPage'
  },
  {
    title: 'Mapa Supervisores',
    icon: 'map',
    component: 'MapGenericSupPage'
  }
];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private sim: Sim,
    private storage: Storage,
    public loginService: LoginService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.obtenerImei();
      this.suscribirCanal();
      this.splashScreen.hide();
      this.disenabledMenu();
    });
  }

  openPage( page ) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component !== this.currentPage) {
      this.currentPage = page.component;
      this.navMaster.setRoot(page.component);
    }
  }

  private disenabledMenu() {
    this.menuCtrl.enable(false, 'menuJefe');
    this.menuCtrl.enable(false, 'menuSuper');
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
      },
        (error) => console.log('Permission denied')
      );

    } else { // is WEB NO TENEMOS SIM EN UN PC
      // const imei = '356265066243709'; // pruebas
      // const imei = '358993064450418'; // SUPER
      // const imei = '359825061511512'; // JEFE
      // const imei = '353642091466930'; // JEFE Tarija
      const imei = '867539021089619'; // sucre jefe
      // const imei = '867539021087324'; // ronald
      // const imei = '357815083659037'; // Roberto
      // const imei = '356811079170536'; // PELAEZ

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
