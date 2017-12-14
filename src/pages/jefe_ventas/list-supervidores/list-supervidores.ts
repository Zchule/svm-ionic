import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

import { SupervisoresProvider } from '../../../providers/supervisores.service';

@IonicPage()
@Component({
  selector: 'page-list-supervidores',
  templateUrl: 'list-supervidores.html',
})
export class ListSupervidoresPage {

  listsSupervisores: any[] = [];
  supervisores: any = {};
  fecha: string;
  imeiCel: string;
  subscriptions: Subscription[] = [];
  load: Loading;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private supervisorService: SupervisoresProvider,
    private storage: Storage,
    private network: Network
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListSupervidoresPage');
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    const subscriptionFechaServidor = this.supervisorService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fecha = data.fecha;
      this.checkImei();
    });
    this.subscriptions.push(subscriptionFechaServidor);
    this.verificarInternet();
    this.load.dismiss();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuJefe');
    this.supervisorService.stopGetSupervisorAllOnline();
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.supervisorService.stopGetSupervisorAllOnline();
  }

  goToMapPage(supervisor) {
    console.log(supervisor);
    if (supervisor.hora === '00:00:00') {
      const alert = this.alertCtrl.create({
        title: 'Supervisor',
        subTitle: 'No hay datos',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const key = supervisor.imei;
      const name = supervisor.nombreVendedor;
      this.navCtrl.push('MapSupervisorPage', {
        key: key,
        name: name
      });
    }
  }

  goToListVendedores(supervisor) {
    this.navCtrl.push('PreventaPage', {
      key: supervisor.imei
    });
  }

  private checkImei() {
    this.storage.get('imei')
    .then(imei => {
      console.log('imei llego', imei);
      // this.imeiCel = '359825061511512';
      this.imeiCel = imei;
      this.getSupervisores();
    });
  }

  private getSupervisores() {
    const subscriptionSupervisorAllChannel = this.supervisorService.getSupervisorAllChannel()
    .subscribe(supervisor => {
      if (supervisor !== null) {
        console.log('supervisor', supervisor);
        if (this.supervisores.hasOwnProperty(supervisor.imei)) {
          const supervisorActual = this.supervisores[supervisor.imei];
          supervisor.posicion = supervisorActual.posicion;
          this.listsSupervisores[supervisorActual.posicion] = supervisor;
        } else {
          supervisor.posicion = this.listsSupervisores.length;
          this.supervisores[supervisor.imei] = supervisor;
          this.listsSupervisores.push(supervisor);
        }
        this.storage.set('SupervisoresList', JSON.stringify(this.supervisores));
      }
    });
    this.subscriptions.push(subscriptionSupervisorAllChannel);
    // getSupervisorAllOnline va estricamente despues de getVendedorAllChannel
    this.supervisorService.getSupervisorAll(this.imeiCel, this.fecha);
  }

  private verificarInternet() {
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Lista sin actualizar',
        buttons: ['OK']
      });
      alert.present();
    } else {
      // Si tiene conexion verifica conexion con firebase
    }
  }


}
