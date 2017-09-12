import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController} from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { DataService } from '../../providers/data.service';
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
  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadCtrl: LoadingController,
    public loginService: LoginService,
    public dataService: DataService
    ) {
      console.log(this.loginService.getUser());
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    this.UserLogged = this.loginService.getUser();
    this.loginService.getVendedorAll(this.UserLogged.IdSupervisor).then(data=>{
      console.log(data);
      this.listsVendedores = data;
      load.dismiss(); 
    })
  }

  goToMapPage(vendedor){
    this.dataService.getVendedor(vendedor.imei).subscribe(data=>{
      this.navCtrl.push('MapPage', {
        vendedor: data
      });
    });
  }

}
