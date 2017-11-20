import { Component } from '@angular/core';
import { IonicPage, NavParams, MenuController, Loading, LoadingController, AlertController} from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';

import { SupervisoresProvider } from '../../providers/supervisores.service';

declare var google;

@IonicPage({
  // name: 'map-supervisor',
  // segment: 'map-supervisor/:key'
})

@Component({
  selector: 'page-map-supervisor',
  templateUrl: 'map-supervisor.html',
})
export class MapSupervisorPage {

  map: any;
  key: string;
  name: string;
  load: Loading;
  myPosition: any = {};
  infowindow: any;
  fecha: string;
  markerSuper: any = null;
  geoList = {};
  linesPath: any = null;
  hora: string;
  isCenter = false;

  subscriptions: Subscription[] = [];

  constructor(
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private mapService: SupervisoresProvider,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private network: Network
  ) {
    this.key = this.navParams.get('key');
    this.name = this.navParams.get('name');
    this.infowindow = new google.maps.InfoWindow();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapSupervisorPage');
    this.load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    this.load.present();
    const subscriptionFechaServidor = this.mapService.getFechaServidor()
    .valueChanges()
    .subscribe((data: any) => {
      this.fecha = data.fecha;
      this.loadMap();
    });
    this.subscriptions.push(subscriptionFechaServidor);
    this.verificarConexion();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'menuJefe');
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private verificarConexion() {
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Mapa sin conexion',
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
      this.obtenerSupervisor();
    });
  }

  private obtenerSupervisor() { // this.mapService.runSimulation(this.key, this.fecha);
    const subscriptionGetVendedor = this.mapService.getSupervisorMap(this.key, this.fecha)
    .subscribe(points => {
      console.log('point', points);
      this.renderMarkers(points);
    });
    this.subscriptions.push(subscriptionGetVendedor);
    const subscriptionSupervisorPosicionActual = this.mapService.getSupervisorPosicionActual(this.key)
    .subscribe((posicionActual: any) => {
      console.log(posicionActual);
      const latitud = posicionActual.latitud;
      const longitud = posicionActual.longitud;
      const newCenter = new google.maps.LatLng(latitud, longitud);
      console.log(latitud, longitud);
      if (this.isCenter === false) {
        this.map.setCenter(newCenter);
        this.isCenter = true;
      }
      const icon = './assets/imgs/vendedor.png';
      // si el marker no esta creado crea un marker pero si ya esta creado modifica la posicion
      if (this.markerSuper === null) {
        const tipo = ' SUPERVISOR';
        this.markerSuper = this.createMarker(latitud, longitud, icon, this.name, this.key, posicionActual.hora, tipo);
      } else {
        this.markerSuper.setPosition(newCenter);
      }
    });
    this.subscriptions.push(subscriptionSupervisorPosicionActual);
  }

  // crea un marker para ese punto
  private createPoint(key: string, point: any) {
    // console.log( 'createPoint', point );
    // crear objeto
    this.geoList[key] = {};
    // crear punto
    this.geoList[key].point = Object.assign({}, point);
    // obtengo el tipo correcto
    // console.log('position: ', type, this.geoList[key].point.latitud, this.geoList[key].point.longitud);
    // obtengo el icono correcto de acuerdo al tipo
    const icon = ' ';
    // crear el marker de este punto
      this.geoList[key].marker = this.createMarker(
        point.latitud,
        point.longitud,
        icon,
        point.nombre,
        point.key,
        point.hora,
        point.tipo
      );
  }

  // actualiza la informacion sin tener que crear un marker
  private updatePoint(key: string, point: any) {
    // console.log( 'updatePoint', point );
    this.geoList[key].point = Object.assign({}, point);
    // obtengo el tipo correcto
    // console.log('position: ', type, this.geoList[key].point.latitud, this.geoList[key].point.longitud);
    // obtengo el icono correcto de acuerdo al tipo
    // modifica la posicion del marker
    if ( this.geoList[key].marker ) {
      this.geoList[key].marker.setPosition({
        lat: point.latitud,
        lng: point.longitud
      });
    }
  }

  private renderMarkers(geoPuntosList: any[]) {
    const lines = [];
    geoPuntosList.forEach((point) => {
      // verifica si el punto ya esta creado dentro en this.geoList si ya esta lo actualiza, si no esta lo crea
      if (this.geoList.hasOwnProperty(point.key)) {
        const updatePoint = point.payload.val();
        this.updatePoint(point.key, updatePoint);
        lines.push({ lat: updatePoint.latitud, lng: updatePoint.longitud });
      } else {
        const newPoint = point.payload.val();
        this.createPoint(point.key, newPoint);
        lines.push({ lat: newPoint.latitud, lng: newPoint.longitud });
        // this.hora = newPoint.hora;
      }
    });
    this.createLines(lines);
  }

  private createLines(lines: any[]) {
    // si ya hay unas lineas creadas las elimina antes de crear las nuevas
    if (this.linesPath !== null) {
      this.linesPath.setMap(null);
    }
    this.linesPath = new google.maps.Polyline({
      path: lines,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.linesPath.setMap(this.map);
  }

  private createMarker(lat: number, lng: number, icon: string, nombre: string, id: string,  hora: string, tipo: string) {
    const options = {
      position: {
        lat: lat,
        lng: lng
      },
      title: nombre,
      map: this.map,
      icon: icon,
      zIndex: Math.round(lat * -100000)
    };
    const marker = new google.maps.Marker(options);
    const contentString = '<div>' +
                        '<div>' + tipo + ': <b>' + nombre + '</b> </div>' +
                        '<div> CODIGO: <b> ' + id + ' </b></div>' +
                        '<p> HORA: <b> ' + hora + ' </b></p>' +
                        '</div>';
      marker.addListener('click', () => {
      this.infowindow.setContent(contentString);
      this.infowindow.open(this.map, marker);
    });
    return marker;
  }

}
