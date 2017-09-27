import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

import { LoginService } from '../../providers/login.service';
import { VendedorService } from '../../providers/vendedor.service';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-preventa',
  templateUrl: 'preventa.html',
})
export class PreventaPage {

  listsVendedores: any;
  vendedores: any = {};
  myDate: String = new Date().toISOString().substring(0, 10);
  users: any[] = [];
  fecha: string;
  imeiCel: string;
  

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    private vendedorService: VendedorService,
    private loginService: LoginService,
    private storage: Storage,
    private network: Network,
    
  ) {  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'menuAdmin');
  }

  ionViewDidLoad() {
    this.verificarAcessoFirebase();
    this.vendedorService.getFechaServidor()
    .subscribe(data => {
      this.fecha = data.fecha;
      this.getVendedores();
    });
  }

  private verificarAcessoFirebase(){
    this.vendedorService.getConexion()
    .then(data=>{
      console.log("conexion", data)
      if(data !== 200){
        const alert = this.alertCtrl.create({
          subTitle: 'Sin acceso a Firebase',
          buttons: ['OK']
        });
        alert.present();
      }
    }).catch(error=>{
      console.error(error);
    })
  }

  private getVendedores() {
    const load = this.loadCtrl.create({
      content: 'Cargando...'
    });
    load.present();
    // this.storage.get('imei')
    // .then(imei=>{
    //     console.log('imei vendedores', imei)
    this.imeiCel = '358239057387500';
    this.loginService.getVendedoresChannel()
    .subscribe(vendedores =>{
      console.log('getVendedorAll suscribe', vendedores);
      if(vendedores){
        let list = Object.assign([], vendedores);
        console.log(typeof(list));
        list.map(item=>{
          console.log(item);
          item.efectividad = 0;
          if (item['registro:' + this.fecha] !== undefined) {
            item.efectividad = item['registro:' + this.fecha].efectividad;
          }
          return item;
        })
        this.listsVendedores = list;
        console.log(this.listsVendedores);
        this.verificarInternet();
      }
    });

    console.log(this.listsVendedores);
    this.loginService.getVendedorAll(this.imeiCel);
    load.dismiss();
    // .then(data => {
    //   console.log('getVendedorAll', data);
    //   const lista = Object.assign([], data);
    //   console.log(typeof(lista));
    //   lista.map(item => {
    //   console.log(item);
    //   item.efectividad = 0;
    //     if (item['registro:' + this.fecha] !== undefined) {
    //       item.efectividad = item['registro:' + this.fecha].efectividad;
    //     }
    //     return item;
    //   });
    //   this.listsVendedores = lista;
    //   console.log(this.listsVendedores);
    //   load.dismiss();
    //   this.verificarInternet();
    // })

  // })
  }

  private verificarInternet(){
    if (this.network.type === 'none') {
      console.log(this.network.type);
      const alert = this.alertCtrl.create({
        title: 'Sin conexión',
        subTitle: 'Lista sin actualizar',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  goToMapPage(vendedor) {
    const key = vendedor.$key;
    this.navCtrl.push('map', {
      key: key
    });
  }

  
}
