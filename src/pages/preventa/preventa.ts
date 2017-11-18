import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

import { VendedorService } from '../../providers/vendedor.service';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  listsVendedores: any[] = [];
  vendedores: any = {};
  fecha: string;
  imeiCel: string;
  subscriptions: Subscription[] = [];
  load: Loading;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private vendedorService: VendedorService,
    private storage: Storage,
    private network: Network
  ) { }

  ionViewDidLoad() {
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    const subscriptionFechaServidor = this.vendedorService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fecha = data.fecha;
      this.checkImei();
    });
    this.subscriptions.push(subscriptionFechaServidor);
    this.verificarInternet();
    this.getVendedores();
    this.load.dismiss();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuSuper');
    this.vendedorService.stopGetVendedorAllOnline();
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.vendedorService.stopGetVendedorAllOnline();
  }

  goToMapPage(vendedor) {
    if (vendedor.hora === '00:00:00') {
      const alert = this.alertCtrl.create({
        title: 'Vendedor',
        subTitle: 'No hay datos',
        buttons: ['OK']
      });
      alert.present();
    }else {
      const key = vendedor.imei;
      const name = vendedor.nombreVendedor;
      this.navCtrl.push('map', {
        key: key,
        name: name
      });
    }
  }

  private checkImei() {
    this.storage.get('imei')
    .then(imei => {
      console.log('imei llego', imei);
      // this.imeiCel = '356811079170536';
      this.imeiCel = imei;
      this.getVendedores();
    });
  }

  private getVendedores() {
    const subscriptionVendedorAllChannel = this.vendedorService.getVendedorAllChannel()
    .subscribe(vendedor => {
      if (vendedor !== null) {
        console.log('vendedores', vendedor);
        if (this.vendedores.hasOwnProperty(vendedor.imei)) {
          const vendedorActual = this.vendedores[vendedor.imei];
          vendedor.posicion = vendedorActual.posicion;
          this.listsVendedores[vendedorActual.posicion] = vendedor;
        }else {
          vendedor.posicion = this.listsVendedores.length;
          this.vendedores[vendedor.imei] = vendedor;
          this.listsVendedores.push(vendedor);
        }
        this.storage.set('vendedoresList', JSON.stringify(this.vendedores));
      }
    });
    this.subscriptions.push(subscriptionVendedorAllChannel);
    // getVendedorAllOnline va estricamente despues de getVendedorAllChannel
    this.vendedorService.getVendedorAll(this.imeiCel, this.fecha);
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
    }else {
      // Si tiene conexion verifica conexion con firebase
      this.verificarAcessoFirebase();
    }
  }

  private verificarAcessoFirebase() {
  //   this.vendedorService.getConexion()
  //   .then(data => {
  //     console.log('conexion', data);
  //   })
  //   .catch(error => {
  //     const alert = this.alertCtrl.create({
  //       subTitle: 'Sin acceso a Firebase',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   })
  }
}
