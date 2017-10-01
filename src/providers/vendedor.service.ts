import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class VendedorService {

  getVendedorAllRef: BehaviorSubject<any>;
  vendedoresListRef: Subscription;
  efectividadRef: Subscription;
  horaRef: Subscription;

  constructor(
    private fireDatabase: AngularFireDatabase,
    private http: Http,
    private storage: Storage,
    private network: Network,
    private platform: Platform
  ) {
    this.getVendedorAllRef = new BehaviorSubject(null);
  }

  getVendedor(id: string) {
    return this.fireDatabase.object('/vendedores/' + id);
  }

  getFechaServidor() {
    return this.fireDatabase.object('/Servidor');
  }

  getConexion() {
    return this.http.get('https://firebasestorage.googleapis.com/v0/b/svmmoviltest.appspot.com/o/check-conexion.json?alt=media&token=4069678c-c030-4853-be60-c299f597c021')
    .map(res => res.json())
    .toPromise();
  }

  getVendedorAllOnline(id: string, fecha): void {
    console.log('getVendedorAllOnline');
    this.vendedoresListRef = this.fireDatabase.list(`/Supervisores/${id}/VendedoresList`)
    .subscribe( vendedoresList => {
      console.log(vendedoresList);
      vendedoresList.forEach((vendedor)=>{
        vendedor.efectividad = 0;
        vendedor.hora = "00:00:00";
        this.getVendedorAllRef.next(vendedor);
        this.horaRef = this.fireDatabase.object(`/vendedores/${vendedor.imei}/PosicionActual/hora`)
        .subscribe( hora => {
          console.log("hora", hora);
          if(hora !== null){
            vendedor.hora = hora.$value;
            this.getVendedorAllRef.next(vendedor); //{}
          }
        });
      })
      // const vendedor = dataSnapshot.val();

      // this.efectividadRef = this.fireDatabase.database.ref(`/vendedores/${vendedor.imei}/registro:${fecha}/efectividad`)
      // .on('value', dataEfectividadSnapshot => {
      //   const efectividad = dataEfectividadSnapshot.val();
      //   console.log("cambio efectividad", efectividad);
      //   if(efectividad !== null){
      //     vendedor.efectividad = efectividad;
      //     this.getVendedorAllRef.next(vendedor);
      //   }
      // })
    });
  }

  stopGetVendedorAllOnline(){
    if(this.vendedoresListRef !== null){
      console.log('apagando vendedores');
      this.vendedoresListRef.unsubscribe();
    }
    if(this.horaRef !== null){
      console.log('apagando hora');
      this.horaRef.unsubscribe();
    }
    // if(this.efectividadRef !== null){
    //   console.log('apagando efectividad');
    //   this.efectividadRef.off();
    // }
  }

  getVendedorAllOffline(id: string): void {
    console.log('getVendedorAllOffline');
    this.storage.get('vendedoresList')
    .then(data => {
      const vendedoresOffline = JSON.parse(data); 
      Object.keys(vendedoresOffline).forEach(key => {
        this.getVendedorAllRef.next(vendedoresOffline[key]);
      })
    });
  }

  getVendedorAll(id: string, fecha): void {
    if (this.platform.is('cordova')) {
      if (this.network.type !== 'none') {
        this.getVendedorAllOnline(id, fecha);
      }else {
        this.getVendedorAllOffline(id);
      }
     } else {
      this.getVendedorAllOnline(id, fecha);
    }
  }

  getVendedorAllChannel() {
    return this.getVendedorAllRef.asObservable();
  }

}
