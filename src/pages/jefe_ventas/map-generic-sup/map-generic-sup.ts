import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, AlertController } from 'ionic-angular';

import { MapGenericSupService } from '../../../providers/map-generic-sup';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map-generic-sup',
  templateUrl: 'map-generic-sup.html',
})
export class MapGenericSupPage {

  map: any;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];
  load: Loading;
  supervisores: any = {};
  infowindow: any;
  fecha: string;
  imeiCel: string;

  subscriptions: Subscription[] = [];

  constructor(
    private loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    private mapGenericService: MapGenericSupService,
    private storage: Storage,
    private network: Network
  ) {
    this.bounds = new google.maps.LatLngBounds();
    this.infowindow = new google.maps.InfoWindow();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapGenericSupPage');
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    const subscriptionFechaServidor = this.mapGenericService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fecha = data.fecha;
      this.checkImei();
    });
    this.subscriptions.push(subscriptionFechaServidor);
    this.verificarInternet();
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private verificarInternet() {
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Necesita conectarse',
        buttons: ['OK']
      });
      alert.present();
      this.load.dismiss();
    }
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
      this.load.dismiss();
      this.obtenerVendedores();
    });
   }

  private obtenerVendedores() {
    const subscriptionVendedoresChannel = this.mapGenericService.getVendedoresChannelOb()
    .subscribe(vendedor => {
      console.log('subscriptionVendedoresChannel', vendedor);
      if (vendedor !== null) {
        if (this.supervisores.hasOwnProperty(vendedor.imei)) { // ya lo tengo
          this.supervisores[vendedor.imei].data = vendedor;
          const lat = vendedor.posicionActual.latitud;
          const lng = vendedor.posicionActual.longitud;
          this.supervisores[vendedor.imei].marker.setPosition({
            lat: lat,
            lng: lng
          });
        } else { // no lo tengo
          this.supervisores[vendedor.imei] = {};
          this.supervisores[vendedor.imei].data = vendedor;
          const lat = vendedor.posicionActual.latitud;
          const lng = vendedor.posicionActual.longitud;
          const icon = './assets/imgs/marker1.png';
          const title = vendedor.nombreVendedor;
          this.supervisores[vendedor.imei].marker = this.createMarker(lat, lng, icon, title);
          this.fixBounds(lat, lng);
        }
      } else {
        const alert = this.alertCtrl.create({
          title: 'Sin Datos',
          subTitle: 'No se tiene Registros',
          buttons: ['OK']
        });
        alert.present();
      }
    });
    this.subscriptions.push(subscriptionVendedoresChannel);
    this.mapGenericService.getVendedoresMapGeneric(this.imeiCel, this.fecha);
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
    const contentString = '<div>' +
    '<div>SUPERVISOR: <br><b>' + title + '</b> </div>';

    marker.addListener('click', () => {
      this.infowindow.setContent(contentString);
      this.infowindow.open(this.map, marker);
    });
    return marker;
  }

  private fixBounds(lat: number, lng: number) {
    const point = new google.maps.LatLng(lat, lng);
    this.bounds.extend(point);
    this.map.fitBounds(this.bounds);
  }

  private checkImei() {
    this.storage.get('imei')
    .then(imei => {
      console.log('imei llego', imei);
      // this.imeiCel = '354152087178696';
      this.imeiCel = imei;
      this.loadMap();
    });
  }
}
