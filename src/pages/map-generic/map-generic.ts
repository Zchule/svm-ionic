import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { LoginService } from '../../providers/login.service';

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
  vendedores: any = {};

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private geolocation: Geolocation,
    private loginService: LoginService
  ) {
    this.bounds = new google.maps.LatLngBounds();
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
    let lat: number;
    let lng: number;
    this.loginService.getVendedorAllOnlineRealtimeoOb()
    .subscribe(vendedor =>{
      if(vendedor){
        if(!this.vendedores[vendedor.imei]){
          this.vendedores[vendedor.imei] = {};
          this.vendedores[vendedor.imei].info = vendedor;
          lat = vendedor.PosicionActual.latitud;
          lng = vendedor.PosicionActual.longitud;
          this.vendedores[vendedor.imei].marker = this.createMarker(lat, lng, '', 'Hola');
        }else{
          this.vendedores[vendedor.imei].info = vendedor;
          lat = vendedor.PosicionActual.latitud;
          lng = vendedor.PosicionActual.longitud;
          this.vendedores[vendedor.imei].marker.setPosition({
            lat: lat,
            lng: lng
          });
        }
        this.fixBounds(lat,lng);
      }
    });
    this.loginService.getVendedorAllOnlineRealtime('212');
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

  private fixBounds(lat: number, lng: number){
    const point = new google.maps.LatLng(lat,lng);
    this.bounds.extend(point);
    this.map.fitBounds(this.bounds);
  }

}