import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { DataService } from '../../providers/data.service';

import { FirebaseListObservable } from 'angularfire2/database';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: any;
  dato: any = null;
  load: Loading;
  datos: FirebaseListObservable<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    public dataService: DataService,
    private loadCtrl: LoadingController
  ) {
    this.dato = this.navParams.get('dato');
    console.log(this.dato);
  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    this.datos = this.dataService.getAll();
    this.datos.subscribe(data=>{
      load.dismiss(); 
      let latitude = this.dato.latitude;
      let longitude =  this.dato.longitude;
      console.log(latitude, longitude);
      
      // create a new map by passing HTMLElement
      let mapEle: HTMLElement = document.getElementById('map');
      let panelEle: HTMLElement = document.getElementById('panel');
      
      // create LatLng object
      let myLatLng = {lat: latitude, lng: longitude};
    
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 12
      });
    
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        let marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          title: 'Hello World!'
        });
      }); 
      
    })
  
  }
  
}
