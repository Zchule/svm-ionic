import { Component } from '@angular/core';
import { IonicPage, NavParams, MenuController, Loading, LoadingController, AlertController} from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { MapService } from '../../../providers/map.service';
import { Network } from '@ionic-native/network';

declare var google;

@IonicPage({
  name: 'map',
  segment: 'map/:key'
})

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: any;
  key: string;
  name: string;
  load: Loading;
  myPosition: any = {};
  infowindow: any;
  fecha: string;
  markerVendedor: any = null;
  geoList = {};
  linesPath: any = null;
  hora: string;
  isCenter = false;
  tipo: any;

  subscriptions: Subscription[] = [];

  indicadores = {
    venta: {
      count: 0,
      text: 'Venta',
      estado: true
    },
    ventaAnulada: {
      count: 0,
      text: 'Venta Anulada',
      estado: true
    },
    pedido: {
      count: 0,
      text: 'Pedido',
      estado: true
    },
    pedidoAnulado: {
      count: 0,
      text: 'Pedido Anulado',
      estado: true
    },
    visita: {
      count: 0,
      text: 'Visita',
      estado: true
    },
    devolucion: {
      count: 0,
      text: 'Devolucion',
      estado: true
    }
  };

  constructor(
    private navParams: NavParams,
    private loadCtrl: LoadingController,
    private mapService: MapService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private network: Network
  ) {
    this.key = this.navParams.get('key');
    this.name = this.navParams.get('name');
    this.infowindow = new google.maps.InfoWindow();
  }

  ionViewDidLoad() {
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
    this.menuCtrl.enable(false, 'menuSuper');
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
      this.obtenerVendedor();
    });
  }

  private obtenerVendedor() { // this.mapService.runSimulation(this.key, this.fecha);
    const subscriptionGetVendedor = this.mapService.getVendedor(this.key, this.fecha)
    .subscribe(points => {
      console.log('point', points);
      this.resetCounts();
      this.renderMarkers(points);
    });
    this.subscriptions.push(subscriptionGetVendedor);
    const subscriptionVendedorPosicionActual = this.mapService.getVendedorPosicionActual(this.key)
    .subscribe((posicionActual: any) => {
      const latitud = posicionActual.latitud;
      const longitud = posicionActual.longitud;
      const newCenter = new google.maps.LatLng(latitud, longitud);
      if (this.isCenter === false) {
        this.map.setCenter(newCenter);
        this.isCenter = true;
      }
      const icon = './assets/imgs/vendedor.png';
      // si el marker no esta creado crea un marker pero si ya esta creado modifica la posicion
      if (this.markerVendedor === null) {
        const tipo = 'VENDEDOR';
        this.markerVendedor = this.createMarker(latitud, longitud, icon, this.name, this.key, posicionActual.hora, tipo);
      } else {
        this.markerVendedor.setPosition(newCenter);
      }
    });
    this.subscriptions.push(subscriptionVendedorPosicionActual);
  }

  // crea un marker para ese punto
  private createPoint(key: string, point: any) {
    // console.log( 'createPoint', point );
    // crear objeto
    this.geoList[key] = {};
    // crear punto
    this.geoList[key].point = Object.assign({}, point);
    // obtengo el tipo correcto
    const type = this.getType(point);
    this.indicadoresList(type);
    this.geoList[key].point.tipo = type;
    // console.log('position: ', type, this.geoList[key].point.latitud, this.geoList[key].point.longitud);
    // obtengo el icono correcto de acuerdo al tipo
    const icon = this.getIcon(type);
    // crear el marker de este punto
    if (icon !== '') {
      const tipo = 'CLIENTE';
      this.geoList[key].marker = this.createMarker(
        point.latitud,
        point.longitud,
        icon,
        point.nombreCliente,
        point.clienteId,
        point.hora,
        tipo
      );
    }
  }

  // actualiza la informacion sin tener que crear un marker
  private updatePoint(key: string, point: any) {
    // console.log( 'updatePoint', point );
    this.geoList[key].point = Object.assign({}, point);
    // obtengo el tipo correcto
    const type = this.getType(point);
    this.indicadoresList(type);
    this.geoList[key].point.tipo = type;
    // console.log('position: ', type, this.geoList[key].point.latitud, this.geoList[key].point.longitud);
    // obtengo el icono correcto de acuerdo al tipo
    const icon = this.getIcon(type);
    // modifica la posicion del marker
    if ( this.geoList[key].marker ) {
      this.geoList[key].marker.setPosition({
        lat: point.latitud,
        lng: point.longitud
      });
      // modifica icono
      this.geoList[key].marker.setIcon(icon);
    }
  }

  private indicadoresList(type) {
    if (type === 'VISITA') {
      this.indicadores.visita.count++;
    } else if (type === 'VENTA') {
      this.indicadores.venta.count++;
    } else if (type === 'DEVOLUCION') {
      this.indicadores.devolucion.count++;
    } else if (type === 'VENTA_ANULADA') {
      this.indicadores.ventaAnulada.count++;
    }
  }

  // retorna el icono indicado de acuerdo al tipo
  private getIcon(tipo: string) {
    switch (tipo) {
      case 'VENTA': {
        return './assets/imgs/venta.png';

      }case 'VISITA': {
        return './assets/imgs/visita.png';
      }
      case 'DEVOLUCION': {
        return './assets/imgs/devolucion.png';
      }
      case 'VENTA_ANULADA': {
        return './assets/imgs/ventaAnulada.png';
      }
      default: {
        return '';
      }
    }
  }

  // retorna el tipo adeacuado segun la informacion
  private getType(point: any) {
    if (point.tipo === 'VENTA' && point.estadoPV === 'ANULADO') {
      return 'VENTA_ANULADA';
    } else {
      return point.tipo;
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
    const seq = {
      repeat: '50px',
      icon: {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 1,
        fillOpacity: 0,
        strokeColor: '#2677FF',
        strokeWeight: 2,
        strokeOpacity: 1
      }
    };
    // si ya hay unas lineas creadas las elimina antes de crear las nuevas
    if (this.linesPath !== null) {
      this.linesPath.setMap(null);
    }
    this.linesPath = new google.maps.Polyline({
      path: lines,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [seq]
    });
    this.linesPath.setMap(this.map);
  }

  private createMarker(lat: number, lng: number, icon: string, nombre: string, id: string, hora: string, tipo: string) {
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


  toggleVenta() {
    // Si el estado esta en true lo vuele false y si esta en false lo vuelve true
    this.indicadores.venta.estado = !this.indicadores.venta.estado;
    this.ocultarPuntos();
  }

  toggleVisita() {
    this.indicadores.visita.estado = !this.indicadores.visita.estado;
    this.ocultarPuntos();
  }

  toggleVentaAnulada() {
    this.indicadores.ventaAnulada.estado = !this.indicadores.ventaAnulada.estado;
    this.ocultarPuntos();
  }

  toggleDevolucion() {
    this.indicadores.devolucion.estado = !this.indicadores.devolucion.estado;
    this.ocultarPuntos();
  }

  ocultarPuntos() {
    // recorrer la lista de points
    for (const key in this.geoList) {
      // verifica si el punto existe dentro de this.geoList
      if (this.geoList.hasOwnProperty(key)) {
        const item = this.geoList[key];
        // item.marker.setVisible(true);
        if (this.indicadores.venta.estado === false && item.point.tipo === 'VENTA') {
          item.marker.setVisible(false);
        } else if (this.indicadores.venta.estado === true && item.point.tipo === 'VENTA') {
          item.marker.setVisible(true);
        }

        if (this.indicadores.visita.estado === false && item.point.tipo === 'VISITA' ) {
          item.marker.setVisible(false);
        } else if (this.indicadores.visita.estado === true && item.point.tipo === 'VISITA') {
          item.marker.setVisible(true);
        }

        if (this.indicadores.ventaAnulada.estado === false && item.point.tipo === 'VENTA_ANULADA' ) {
          item.marker.setVisible(false);
        } else if (this.indicadores.ventaAnulada.estado === true && item.point.tipo === 'VENTA_ANULADA') {
          item.marker.setVisible(true);
        }

        if (this.indicadores.devolucion.estado === false && item.point.tipo === 'DEVOLUCION' ) {
          item.marker.setVisible(false);
        } else if (this.indicadores.devolucion.estado === true && item.point.tipo === 'DEVOLUCION') {
          item.marker.setVisible(true);
        }
      }
    }
  }

  private resetCounts() {
    this.indicadores.devolucion.count = 0;
    this.indicadores.venta.count = 0;
    this.indicadores.ventaAnulada.count = 0;
    this.indicadores.visita.count = 0;
  }
}
