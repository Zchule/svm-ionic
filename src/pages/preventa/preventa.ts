import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, LoadingController} from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { DataService } from '../../providers/data.service';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  datos: FirebaseListObservable<any>;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private modalCtrl: ModalController,
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

  addPreventa(){
    let modal = this.modalCtrl.create('CreatePage');
    modal.present();
  }
  goToMapPage(dato){
    this.navCtrl.push('MapPage', {
      dato: dato
    });
  }

}
