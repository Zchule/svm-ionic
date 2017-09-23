import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { LoginService } from '../../providers/login.service';
import { VendedorService } from '../../providers/vendedor.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  listsVendedores: any;
  vendedores: FirebaseListObservable<any>;
  myDate: String = new Date().toISOString().substring(0, 10);
  users: any[] = [];
  fecha: string;
  imeiCel: string;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadCtrl: LoadingController,
    private vendedorService: VendedorService,
    private loginService: LoginService,
    private storage: Storage
  ) {  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLoad() {
    this.vendedorService.getFechaServidor()
    .subscribe(data => {
      this.fecha = data.fecha;
      this.getVendedores();
    });
  }

  private getVendedores() {
    const load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    // this.storage.get('imei')
    // .then(imei=>{
    //     console.log('imei vendedores', imei)
    this.imeiCel = '357815085654648';
    this.loginService.getVendedorAll(this.imeiCel)
    .then(data => {
      console.log('getVendedorAll', data);
      const lista = Object.assign([], data);
      lista.map(item => {
      item.efectividad = 0;
        if (item['registro:' + this.fecha] !== undefined) {
          item.efectividad = item['registro:' + this.fecha].efectividad;
        }
        return item;
      });
      this.listsVendedores = lista;
      console.log(this.listsVendedores);
      load.dismiss();
    });

  }

  goToMapPage(vendedor) {
    const key = vendedor.$key;
    this.navCtrl.push('map', {
      key: key
    });
  }
}
