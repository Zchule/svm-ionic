import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map-generic',
  templateUrl: 'map-generic.html',
})
export class MapGenericPage {

  map: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation
  ) {
    
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();

      this.waypoints = [
        {
          location: { lat: 4.6241329, lng: -74.1768411 },
          stopover: true,
        },
        {
          location: { lat: 4.6247745, lng: -74.1698888 },
          stopover: true,
        },
        {
          location: { lat: 4.6212241, lng: -74.1631081 },
          stopover: true,
        },
        {
          location: { lat: 4.6222508, lng: -74.1667989 },
          stopover: true,
        }
      ];

  }

  ionViewDidLoad() {
    this.getPosition();
  }

  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
      })
    .catch(error =>{
      console.log(error);
    })

   }

  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
  
    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};
  
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 12
    });
  
    //this.directionsDisplay.setMap(this.map);
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calculateRoute();
    });

  }
    
  private calculateRoute(){

  this.bounds.extend(this.myLatLng);
  
    this.waypoints.forEach(waypoint => {
      var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
      this.bounds.extend(point);
    });
  
    this.map.fitBounds(this.bounds);


  }

}
