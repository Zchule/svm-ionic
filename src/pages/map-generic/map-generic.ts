import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, AlertController } from 'ionic-angular';

import { LoginService } from '../../providers/login.service';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

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
    public alertCtrl: AlertController,
    private loginService: LoginService,
    private storage: Storage,
    private network: Network
  ) {
    this.bounds = new google.maps.LatLngBounds();
    this.infowindow = new google.maps.InfoWindow();
   }

  ionViewDidLoad() {
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Mapa sin actualizar ',
        buttons: ['OK']
      });
      alert.present();
      this.load.dismiss();
    }
    this.loadMap();
  }

  private loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');

    const latitud = -17.2378799;
    const longitud = -66.7239997;

    // create LatLng object
    const myLatLng = { lat: latitud, lng: longitud };
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

  private obtenerVendedores() {
    let lat: number;
    let lng: number;
    let title: string;
    this.loginService.getVendedorAllOnlineRealtimeoOb()
    .subscribe(vendedor => {
      if (vendedor) {
        if (!this.vendedores[vendedor.imei]) {
          this.vendedores[vendedor.imei] = {};
          this.vendedores[vendedor.imei].info = vendedor;
          lat = vendedor.PosicionActual.latitud;
          lng = vendedor.PosicionActual.longitud;
          title = vendedor.nombreVendedor;
          const icon = './assets/imgs/vendedor.png';
          this.vendedores[vendedor.imei].marker = this.createMarker(lat, lng, icon, title);
        }else {
          this.vendedores[vendedor.imei].info = vendedor;
          lat = vendedor.PosicionActual.latitud;
          lng = vendedor.PosicionActual.longitud;
          this.vendedores[vendedor.imei].marker.setPosition({
            lat: lat,
            lng: lng
          });
        }
        this.fixBounds(lat, lng);
      }
    });
    // this.storage.get('imei')
    // .then(imei=>{
    const imei = '358239057387500';
    this.loginService.getVendedorAllOnlineRealtime(imei);
    // })
    this.load.dismiss();
  }

  private createMarker(lat: number, lng: number, icon: string, title: string) {
    const options = {
      position: {
        lat: lat,
        lng: lng
      },
      title: title,
      map: this.map,
      icon: icon
      // zIndex: (Math.round(lat * -100000)<<5)
    };
    const marker = new google.maps.Marker(options);

    marker.addListener('click', () => {
      this.infowindow.setContent(title);
      this.infowindow.open(this.map, marker);
    });
    
    return marker;
  }

  private fixBounds(lat: number, lng: number) {
    const point = new google.maps.LatLng(lat, lng);
    this.bounds.extend(point);
    this.map.fitBounds(this.bounds);
  }

}
