import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController} from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { VendedorService } from '../../providers/vendedor.service';
import { LoginService } from '../../providers/login.service';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  listsVendedores: any;
  vendedores: FirebaseListObservable<any>;
  myDate: String = new Date().toISOString().substring(0, 10);
  UserLogged : any;
  users: any[] = [];
  fecha: string;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadCtrl: LoadingController,
    public loginService: LoginService,
    public vendedorService: VendedorService
  ) {
    this.vendedorService.getFechaServidor()
    .subscribe(data=>{
      this.fecha = data.fecha;
      console.log(this.fecha)
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
      this.listsVendedores = Object.assign([],data);
      load.dismiss(); 
    })
  }

  goToMapPage(vendedor){
    const key = vendedor.$key;
    this.navCtrl.push('MapPage', {
      key: key
    });
  }

}