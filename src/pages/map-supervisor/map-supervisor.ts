import { Component } from '@angular/core';
import { IonicPage, NavParams, MenuController, Loading, LoadingController, AlertController} from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { MapService } from '../../providers/map.service';
import { Network } from '@ionic-native/network';

declare var google;

@IonicPage(//{
//   name: 'mapa',
//   segment: 'mapa/:key'
// })
)

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
  markerVendedor: any = null;
  geoList = {};
  linesPath: any = null;
  hora: string;
  isCenter = false;

  subscriptions: Subscription[] = [];

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
      // this.obtenerSupervisor();
    });
  }

}
