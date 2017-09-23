import { Component } from '@angular/core';
import { IonicPage, NavParams, MenuController, Loading, LoadingController, AlertController} from 'ionic-angular';

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
  vendedor: any = {};
  myPosition: any = {};
  bounds: any = null;
  infowindow: any;
  fecha: string;
  markers=[];

  indicadores = {
    venta:{
      count: 0,
      text: 'Venta',
      estado: true
    },
    ventaAnulada:{
      count: 0,
      text: 'Venta Anulada',
      estado: true
    },
    pedido:{
      count: 0,
      text: 'Pedido',
      estado: true
    },
    pedidoAnulado:{
      count: 0,
      text: 'Pedido Anulado',
      estado: true
    },
    visita:{
      count: 0,
      text: 'Visita',
      estado: true
    },
    devolucion:{
      count: 0,
      text: 'Devolucion',
      estado: true
    }
  }

  constructor(
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private vendedorService: VendedorService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController
  ) {
    this.key = this.navParams.get('key');
    this.bounds = new google.maps.LatLngBounds();
    this.infowindow = new google.maps.InfoWindow();
  }

  ionViewDidLoad() {

    this.vendedorService.getFechaServidor()
    .subscribe(data=>{
      this.fecha = data.fecha;
      console.log(this.fecha)
    })

    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    this.loadMap();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'menuAdmin');
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
    })
  }

  private obtenerVendedor(){

    this.vendedorService.getVendedor(this.key)
    .subscribe((vendedor)=>{ 
      this.vendedor = vendedor;
      console.log('getVendedor', this.vendedor);
      const latitud = this.vendedor.PosicionActual.latitud;
      const longitud = this.vendedor.PosicionActual.longitud;
      const newCenter = new google.maps.LatLng(latitud, longitud);
      this.map.setCenter( newCenter );
      let icon = './assets/imgs/vendedor.png';
      this.createMarker(latitud, longitud, icon, 'myMarker');
      // this.resetCounts();
      // this.renderMarkers();
      if(this.vendedor['registro:'+ this.fecha] !== undefined){
        console.log(this.vendedor);
        let geoPuntosList: any[] = this.vendedor['registro:'+ this.fecha].geoPuntoList;
        let list = geoPuntosList.slice(this.markers.length, geoPuntosList.length);
        this.renderMarkers(list);
      }else{
        console.log('entro undefined');
        let alert = this.alertCtrl.create({
          subTitle: 'Sin Registro Actual ',
          buttons: ['OK']
        });
        alert.present(); 
      }
        this.load.dismiss();
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
      zIndex: Math.round(lat*-100000)
    }
    let marker = new google.maps.Marker(options);

        marker.addListener('click', ()=>{
          this.infowindow.setContent(title); 
          this.infowindow.open(this.map, marker);
        });
    return marker;
  }
  
  private renderMarkers(geoPuntosList: any[]){
        let lines = [];
        for(let key in geoPuntosList){
          let client = geoPuntosList[key];
          let icon = "";
          if(client.tipo == 'PEDIDO'){
            if(client.estadoPV == 'ANULADO'){
              client.tipo = 'PEDIDO_ANULADO';
              icon = './assets/imgs/pedidoAnulado.png';
              this.indicadores.pedidoAnulado.count++;
              let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
              this.markers.push({
                marker: marker,
                tipo: client.tipo
              });
            }else{
              icon = './assets/imgs/pedido.png';
              this.indicadores.pedido.count++;
              let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
              this.markers.push({
                marker: marker,
                tipo: client.tipo
              });
            }
            
          }else if(client.tipo == 'DEVOLUCION' ){
            icon = './assets/imgs/devolucion.png';
            this.indicadores.devolucion.count++;
            let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
            this.markers.push({
              marker: marker,
              tipo: client.tipo
            });
          }else if(client.tipo == 'VISITA'){
            icon = './assets/imgs/visita.png';
            this.indicadores.visita.count++;
            let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
            this.markers.push({
              marker: marker,
              tipo: client.tipo
            });
          }else if(client.tipo == 'VENTA'){
            if(client.estadoPV == 'ANULADO') {
              client.tipo = 'VENTA_ANULADA';
              icon = './assets/imgs/ventaAnulada.png';
              let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
              this.markers.push({
                marker: marker,
                tipo: client.tipo
              });
              this.indicadores.ventaAnulada.count++;
            }else{
              icon = './assets/imgs/venta.png';
              let marker = this.createMarker(client.latitud, client.longitud, icon, client.nombreCliente);
              this.markers.push({
                marker: marker,
                tipo: client.tipo
              });
              this.indicadores.venta.count++;
            }
          }        
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

  ocultar(estado){
    this.markers.forEach(item=>{
      if(item.tipo == estado && item.tipo == 'VENTA'){ //venta
        if(this.indicadores.venta.estado){
          this.indicadores.venta.estado = false;
          item.marker.setVisible(false);
        }else{
          console.log(this.indicadores.venta.estado );
          this.indicadores.venta.estado = true;
          item.marker.setVisible(true);
          console.log(this.indicadores.venta.estado);
          }     
      }else if(item.tipo == estado && item.tipo == 'PEDIDO'){ //pedido
        if(this.indicadores.pedido.estado){
          item.marker.setVisible(false);
          this.indicadores.pedido.estado = false;
          }else{
          item.marker.setVisible(true);
          this.indicadores.pedido.estado = true;
          }
      }else if(item.tipo == estado && item.tipo == 'VISITA'){  //visita
        if(this.indicadores.visita.estado){
          item.marker.setVisible(false);
          this.indicadores.visita.estado = false;
          }else{
          item.marker.setVisible(true);
          this.indicadores.visita.estado = true;
          }
      }else if(item.tipo == estado && item.tipo == 'VENTA_ANULADA'){ //venta anulada
        if(this.indicadores.ventaAnulada.estado){
          item.marker.setVisible(false);
          this.indicadores.ventaAnulada.estado = false;
          }else{
          item.marker.setVisible(true);
          this.indicadores.ventaAnulada.estado = true;
          }
      }else if(item.tipo == estado && item.tipo == 'PEDIDO_ANULADO'){ //pedido anulado
        this.indicadores.pedidoAnulado.estado = false;
        if(this.indicadores.pedidoAnulado.estado){
          console.log(item.tipo);
          item.marker.setVisible(false);
          }else{
          item.marker.setVisible(true);
          this.indicadores.pedidoAnulado.estado = true;
          }
      }else if(item.tipo == estado && item.tipo == 'DEVOLUCION'){ //devolucion
        if(this.indicadores.devolucion.estado){
          console.log(item.tipo);
          console.log("DEVOLUCION");
          item.marker.setVisible(false);
          this.indicadores.devolucion.estado = false;
          }else{
          item.marker.setVisible(true);
          this.indicadores.devolucion.estado = true;
          }
        }
      }) 
  }

  private resetCounts(){
    this.indicadores.devolucion.count = 0;
    this.indicadores.pedido.count     = 0;
    this.indicadores.venta.count      = 0;
    this.indicadores.visita.count     = 0;
  }
}
