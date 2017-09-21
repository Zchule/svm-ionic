import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController } from 'ionic-angular';

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
  infowindow: any;
  
  constructor(
    private loadCtrl: LoadingController,
    private loginService: LoginService
  ) { 
    this.bounds = new google.maps.LatLngBounds();
    this.infowindow = new google.maps.InfoWindow();
    console.log('constructor');
   }

  ionViewDidLoad() {
    console.log('entro ahi');
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.loadMap();
    this.load.present();
  }

ionViewDidEnter(){
  console.log('entro did enter');
}

ionViewDidLeave(){
  this.map = null;
  console.log('entro did leave');
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
    let title: string;
    this.loginService.getVendedorAllOnlineRealtimeoOb()
    .subscribe(vendedor =>{
      if(vendedor){
        if(!this.vendedores[vendedor.imei]){
          this.vendedores[vendedor.imei] = {};
          this.vendedores[vendedor.imei].info = vendedor;
          lat = vendedor.PosicionActual.latitud;
          lng = vendedor.PosicionActual.longitud;
          title = vendedor.nombreVendedor;
          this.vendedores[vendedor.imei].marker = this.createMarker(lat, lng, '', title);
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
    this.loginService.getVendedorAllOnlineRealtime('357815085654648');
    this.load.dismiss();
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

    var popup = new google.maps.InfoWindow({
        content: title
      });

    popup.open(this.map, marker);

    return marker;
  }

  private fixBounds(lat: number, lng: number){
    const point = new google.maps.LatLng(lat,lng);
    this.bounds.extend(point);
    this.map.fitBounds(this.bounds);
  }

}