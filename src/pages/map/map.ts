import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { FirebaseListObservable } from 'angularfire2/database';
import { VendedorService } from '../../providers/vendedor.service';
import { LoginService } from '../../providers/login.service';

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
  vendedor: any;
  myPosition: any = {};
  bounds: any = null;
  infowindow: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    public geolocation: Geolocation,
    public vendedorService: VendedorService,
    public loginService: LoginService
  ) {
    this.dato = this.navParams.get('vendedor');
    console.log(this.dato);
    this.bounds = new google.maps.LatLngBounds();
    this.infowindow = new google.maps.InfoWindow();
  }

  ionViewDidLoad() {
    let load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    // load.present();
    // load.dismiss(); 
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
        this.obtenerVendedor();
    }); 
    
  }

  private obtenerVendedor(){
    this.vendedorService.getVendedor(this.dato.$key).subscribe((vendedor)=>{ 
      this.vendedor = vendedor;
      console.log(this.vendedor);
      let latitud = this.vendedor.PosicionActual.latitud;
      let longitud = this.vendedor.PosicionActual.longitud;
      this.myPosition = { lat: latitud, lng: longitud },
      this.map.setCenter({
        lat: latitud, 
        lng: longitud
      });
      let icon = `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld`;
      this.createMarker(latitud, longitud, icon, 'Vendedor');
      this.renderMarkers();
    });
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

        marker.addListener('click', ()=>{
          this.infowindow.setContent(title); 
          this.infowindow.open(this.map, marker);
        });
        return marker;
      }

  private fitBounds(points: any[]){     
    this.bounds.extend(this.myPosition);
      for(let key in points){
        let point = points[key];
        var myLatlng = new google.maps.LatLng(point.latitud, point.longitud);
        this.bounds.extend(myLatlng);
      }
    this.map.fitBounds(this.bounds);
    }
  
  private renderMarkers(){
    this.loginService.getFechaServidor().subscribe(fecha=>{
      console.log(fecha);
    }) 
    let geoPuntosList = this.vendedor['registro:09-12-2017'].geoPuntoList;
    this.fitBounds(geoPuntosList);
    let lines = [];
      for(let key in geoPuntosList) {
          let client = geoPuntosList[key];
          let icon = './assets/imgs/default.png';
          if(client.tipo == 'PEDIDO'){
            icon = './assets/imgs/pedido.png';
          }else if(client.tipo == 'DEVOLUCION' ){
            icon = './assets/imgs/devolucion.png';
          }else if(client.tipo == 'VISITA'){
            icon = './assets/imgs/visita.png';
          }else if(client.tipo == 'VENTA'){
            icon = './assets/imgs/venta.png';
          }
    this.createMarker(client.latitud, client.longitud, icon, client.tipo);
    lines.push({ lat: client.latitud, lng: client.longitud });   
  }

    let linesPath = new google.maps.Polyline({
      path: lines,
      geodesic: true,           
      strokeColor: '#FF0000',           
      strokeOpacity: 1.0,           
      strokeWeight: 2
    });
  linesPath.setMap(this.map);
  } 

}
