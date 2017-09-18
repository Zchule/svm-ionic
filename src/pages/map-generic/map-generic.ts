import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { VendedorService } from '../../providers/vendedor.service';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map-generic',
  templateUrl: 'map-generic.html',
})
export class MapGenericPage {

  map: any;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];
  load: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    public geolocation: Geolocation,
    public vendedorService: VendedorService
  ) {

  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });

    this.loadMap();
  }
  

private loadMap(){   
    //create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
  
    let latitud = -17.2378799;
    let longitud = -66.7239997;

    // create LatLng object
    let myLatLng = { lat: latitud, lng: longitud };
    
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
      
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
        this.obtenerVendedores();
    });   
   }

   private obtenerVendedores(){
    let list = this.vendedorService.getVendedorAll(); 
    console.log(list);
  }


   private createMarker(lat: number, lng: number, icon: string, title: string){
        let options = {
          position: {
            lat: lat,
            lng: lng
          },
          title: title,
          map: this.map,
          icon: icon,
          zIndex: Math.round(lat*-100000)<<5
        }
        let marker = new google.maps.Marker(options);
        return marker;
      }



  }

