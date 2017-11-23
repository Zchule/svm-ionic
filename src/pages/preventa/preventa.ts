import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, Loading, LoadingController, AlertController, NavParams } from 'ionic-angular';
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
  key: string;
  name: string;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private vendedorService: VendedorService,
    private storage: Storage,
    private network: Network,
    private navParams: NavParams
  ) { this.key = this.navParams.get('key'); }

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
    // this.getVendedores();
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
    } else {
      const key = vendedor.imei;
      const name = vendedor.nombreVendedor;
      const tipo = vendedor.tipo;
        console.log('tipo', tipo );
        if (tipo === '0' || tipo === null) {
          this.navCtrl.push('map', {
            key: key,
            name: name
          });
        } else {
          this.navCtrl.push('MapPrevendedoresPage', {
            key: key,
            name: name
          });
        }
    }
  }

  private checkImei() {
    this.storage.get('user')
    .then(user => {
      const userSinup = JSON.parse(user);
      console.log('user logueado', userSinup);
      if (userSinup.tipo === 'jventas') {
        this.imeiCel = this.key;
        console.log('imei vendedor', this.imeiCel);
        this.getVendedores(this.imeiCel);
      } else {
        this.storage.get('imei')
        .then(imei => {
          console.log('imei llego sup', imei);
          // this.imeiCel = '356811079170536';
          this.imeiCel = imei;
          this.getVendedores(this.imeiCel);
        });
      }
    });
  }

  private getVendedores(imei) {
    const subscriptionVendedorAllChannel = this.vendedorService.getVendedorAllChannel()
    .subscribe(vendedor => {
      if (vendedor !== null) {
        console.log('vendedores', vendedor);
        if (this.vendedores.hasOwnProperty(vendedor.imei)) {
          const vendedorActual = this.vendedores[vendedor.imei];
          vendedor.posicion = vendedorActual.posicion;
          this.listsVendedores[vendedorActual.posicion] = vendedor;
        } else {
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
    } else {
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
