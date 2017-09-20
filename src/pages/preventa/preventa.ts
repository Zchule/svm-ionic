import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController} from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { LoginService } from '../../providers/login.service';
import { VendedorService } from '../../providers/vendedor.service';

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

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadCtrl: LoadingController,
    private vendedorService: VendedorService,
    private loginService: LoginService
  ) {
    this.vendedorService.getFechaServidor()
    .subscribe(data=>{
      // this.fecha = data.fecha;
      this.fecha = '09-19-2017';
      console.log(this.fecha);
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    this.loginService.getVendedorAll('357815085654648')
    .then(data =>{
      console.log('getVendedorAll', data);
      let listsVendedores = Object.assign([], data);
      this.listsVendedores = listsVendedores.sort(); 
      load.dismiss(); 
    });
    // this.vendedorService.getListVendedoresActual('357815085654648','09-20-2017').then(vendedor=>{
    //   console.log(vendedor);
    // })
  }

  goToMapPage(vendedor){
    const key = vendedor.$key;
    this.navCtrl.push('MapPage', {
      key: key
    });
  }

}
