import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-map-nativo',
  templateUrl: 'map-nativo.html',
})
export class MapNativoPage {

  map: GoogleMap;
  mapElement: HTMLElement;
  

  constructor(
    private navCtrl: NavController,
    private googleMaps: GoogleMaps
  ) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  private loadMap(){

    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };
  
    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');
      // Now you can use all methods safely.
      //this.getMyLocation();
    });
  }

  private getMyLocation(){
    this.map.getMyLocation({
      enableHighAccuracy: true
    })
    .then(location => {
      console.log(location);
      this.addMarker({
        title: 'Here',
        icon: 'blue',
        position: location.latLng
      });
      this.map.moveCamera({
        target: location.latLng,
        zoom: 18
      });
    })
    .catch(error => {
      console.log(error);
    })
  }
  
  addMarker(options){
    this.map.addMarker(options)
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe(() => {
        alert('clicked');
      });
    });
  }
    

}
