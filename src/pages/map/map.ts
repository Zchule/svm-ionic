import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { VendedorService } from '../../providers/vendedor.service';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: any;
  key: string;
  load: Loading;
  vendedor: any;
  indicadores = {
    venta:{
      count: 0,
      text: 'Venta'
    },
    pedido:{
      count: 0,
      text: 'Pedido'
    },
    visita:{
      count: 0,
      text: 'Visita'
    },
    devolucion:{
      count: 0,
      text: 'Devolucion'
    }
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    public geolocation: Geolocation,
    public vendedorService: VendedorService
  ) {
    this.key = this.navParams.get('key');
    console.log('key', this.key);
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
        this.obtenerVendedor();
    }); 
    
  }

  private obtenerVendedor(){
    this.vendedorService.getVendedor(this.key).subscribe((vendedor)=>{ 
      this.vendedor = vendedor;
      console.log('getVendedor', this.vendedor);
      const latitud = this.vendedor.PosicionActual.latitud;
      const longitud = this.vendedor.PosicionActual.longitud;
      const newCenter = new google.maps.LatLng(latitud, longitud);
      this.map.setCenter( newCenter );
      let icon = `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld`;
      this.createMarker(latitud, longitud, icon, 'myMarker');
      this.resetCounts();
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
    return marker;
  }
  
  private renderMarkers(){
    let geoPuntosList = this.vendedor['registro:09-13-2017'].geoPuntoList;
    let lines = [];
    for(let key in geoPuntosList) {
      let client = geoPuntosList[key];
      let icon = './assets/imgs/default.png';
      if(client.tipo == 'PEDIDO'){
        icon = './assets/imgs/pedido.png';
        this.indicadores.pedido.count++;
      }else if(client.tipo == 'DEVOLUCION' ){
        icon = './assets/imgs/devolucion.png';
        this.indicadores.devolucion.count++;
      }else if(client.tipo == 'VISITA'){
        icon = './assets/imgs/visita.png';
        this.indicadores.visita.count++;
      }else if(client.tipo == 'VENTA'){
        icon = './assets/imgs/venta.png';
        this.indicadores.venta.count++;
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

  private resetCounts(){
    this.indicadores.devolucion.count = 0;
    this.indicadores.pedido.count     = 0;
    this.indicadores.venta.count      = 0;
    this.indicadores.visita.count     = 0;
  }
}
