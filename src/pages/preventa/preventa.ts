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

  listsVendedores: any[] = [];
  vendedores: any = {};
  fecha: string;
  imeiCel: string;
  subscriptions: Subscription[] = [];
  
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private vendedorService: VendedorService,
    private loginService: LoginService,
    private storage: Storage,
    private network: Network,
  ) { }

  ionViewDidLoad() {
    const subscriptionFechaServidor = this.vendedorService.getFechaServidor()
    .subscribe(data => {
      this.fecha = data.fecha;
      this.checkImei();
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

  goToMapPage(vendedor) {
    const key = vendedor.imei;
    this.navCtrl.push('MapPage', {
      key: key
    });
  }

  private checkImei() {
    this.storage.get('imei')
    .then(imei=>{
      console.log('imei llego', imei)
      this.imeiCel = imei;
      this.getVendedores();
    });
  }

  private getVendedores() {
    //this.imeiCel = '358239057387500';
    const subscriptionVendedorAllChannel = this.vendedorService.getVendedorAllChannel()
    .subscribe(vendedor => {
      console.log(vendedor);
      if (vendedor !== null) {
        if (!this.vendedores.hasOwnProperty(vendedor.imei)) {
          this.vendedores[vendedor.imei] = {};
          this.vendedores[vendedor.imei].vendedor = vendedor;
          this.vendedores[vendedor.imei].vendedor.efectividad = this.getEfectividad(vendedor);
          this.vendedores[vendedor.imei].index = this.listsVendedores.length;
          this.listsVendedores.push(this.vendedores[vendedor.imei].vendedor);
        }else{
          this.vendedores[vendedor.imei].vendedor = vendedor;
          this.vendedores[vendedor.imei].vendedor.efectividad = this.getEfectividad(vendedor);
          this.listsVendedores[this.vendedores[vendedor.imei].index] = this.vendedores[vendedor.imei].vendedor;
        }
        // va guardando en local cualquier cambio
        console.log(this.vendedores, this.listsVendedores);
        const dataoffline = JSON.stringify(this.vendedores);
        this.storage.set('vendedoresList', dataoffline);
      }
    });
    this.subscriptions.push(subscriptionVendedorAllChannel);
    // getVendedorAllOnline va estricamente despues de getVendedorAllChannel
    this.vendedorService.getVendedorAll(this.imeiCel, this.fecha);
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
    }else{
      // Si tiene conexion verifica conexion con firebase
      this.verificarAcessoFirebase();
    }
  }

  private verificarAcessoFirebase(){
    // this.vendedorService.getConexion()
    // .then(data=>{
    //   console.log("conexion", data);
    // })
    // .catch(error=>{
    //   const alert = this.alertCtrl.create({
    //     subTitle: 'Sin acceso a Firebase',
    //     buttons: ['OK']
    //   });
    //   alert.present();
    // })
  }

  

  
}
