import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-info-map',
  templateUrl: 'info-map.html',
})
export class InfoMapPage {

  map: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation
    ) {

      this.directionsService = new google.maps.DirectionsService();
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
    let panelEle: HTMLElement = document.getElementById('panel');
  
    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(this.myLatLng);
  
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 12
    });
  
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(panelEle);
  
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
 

    this.directionsService.route({
      origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      destination: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
      waypoints: this.waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status)=> {
      if(status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      }else{
        alert('Could not display directions due to: ' + status);
      }
    });

  }
  
}
