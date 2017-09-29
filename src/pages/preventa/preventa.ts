import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

import { LoginService } from '../../providers/login.service';
import { VendedorService } from '../../providers/vendedor.service';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  vendedores: any = {};
  fecha: string;
  imeiCel: string;
  subscriptions: Subscription[] = [];
  
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vendedorService: VendedorService,
    private loginService: LoginService,
    private storage: Storage,
    private network: Network,
  ) { }

  ionViewDidLoad() {
    this.verificarAcessoFirebase();
    const subscriptionFechaServidor = this.vendedorService.getFechaServidor()
    .subscribe(data => {
      this.fecha = data.fecha;
      this.getVendedores();
    });
    this.subscriptions.push(subscriptionFechaServidor);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private verificarAcessoFirebase(){
    this.vendedorService.getConexion()
    .then(data=>{
      console.log("conexion", data)
      if(data !== 200){
        const alert = this.alertCtrl.create({
          subTitle: 'Sin acceso a Firebase',
          buttons: ['OK']
        });
        alert.present();
      }
    }).catch(error=>{
      console.log(error);
    })
  }

  private getVendedores() {
    
    // this.storage.get('imei')
    // .then(imei=>{
    //     console.log('imei vendedores', imei)
    this.imeiCel = '358239057387500';
    const subscriptionVendedorAllChannel = this.vendedorService.getVendedorAllChannel()
    .subscribe(vendedor => {
      if (vendedor !== null) {
        this.vendedores[vendedor.key] = vendedor;
        this.vendedores[vendedor.key].efectividad = this.getEfectividad(vendedor);
        // va guardando en local cualquier cambio
        const dataoffline = JSON.stringify(this.vendedores);
        this.storage.set('vendedoresList', dataoffline);
      }
    });
    this.subscriptions.push(subscriptionVendedorAllChannel);
    // getVendedorAllOnline va estricamente despues de getVendedorAllChannel
    this.vendedorService.getVendedorAll(this.imeiCel);
    this.verificarInternet();
  }

  private getEfectividad(vendedor: any){
    let efectividad = 0;
    if (vendedor['registro:' + this.fecha] !== undefined) {
      efectividad = vendedor['registro:' + this.fecha].efectividad;
    }
    return efectividad;
  }

  private verificarInternet(){
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Lista sin actualizar',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  goToMapPage(vendedor) {
    const key = vendedor.key;
    this.navCtrl.push('MapPage', {
      key: key
    });
  }

  get listsVendedores() {
    return Object.keys(this.vendedores).map(key => {
      return this.vendedores[key];
    })
  }

  
}
