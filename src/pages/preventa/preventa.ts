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
  ) {  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLoad() {
    
    this.vendedorService.getFechaServidor()
    .subscribe(data =>{
      this.fecha = data.fecha;
      console.log(this.fecha);
      this.getVendedores();
    });

  }

  private getVendedores(){
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    this.loginService.getVendedorAll('357815085654648')
    .then(data =>{
      console.log('getVendedorAll', data);
      let lista = Object.assign([], data);
      lista.map(item =>{
        item.efectividad = 0;
        if(item['registro:'+this.fecha] !== undefined)
        {
          item.efectividad = item['registro:'+this.fecha].efectividad;
        }
        return item;
      }) 
      this.listsVendedores = lista;
      console.log(this.listsVendedores);
      load.dismiss(); 
    });

  }

  goToMapPage(vendedor){
    const key = vendedor.$key;
    this.navCtrl.push('MapPage', {
      key: key
    });
  }

}
