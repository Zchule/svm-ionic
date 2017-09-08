import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';
import { DataService } from '../../providers/data.service';

@IonicPage()
@Component({
  selector: 'page-auto-venta',
  templateUrl: 'auto-venta.html',
})
export class AutoVentaPage {

  datos: FirebaseListObservable<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dataService: DataService,
    public loadCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    this.datos = this.dataService.getAll();
    this.datos.subscribe(data=>{
      load.dismiss(); 
    })
  }

  goToMapPage(){
    console.log("mapa");
    this.navCtrl.push('InfoMapPage');
  }

}

