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

@Injectable()
export class VendedorService {

  getVendedorAllRef: BehaviorSubject<any>;

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
    this.fireDatabase.database.ref(`/Supervisores/${id}/VendedoresList`)
    .on('child_added', dataSnapshot => {
      const vendedor = dataSnapshot.val();
      this.fireDatabase.database.ref(`/vendedores/${vendedor.imei}`)
      .on('value', dataSnapshot => {
        const dataVendedor = dataSnapshot.val();
        dataVendedor.nombreVendedor = vendedor.nombreVendedor;
        dataVendedor.imei = vendedor.imei;
        this.getVendedorAllRef.next(dataVendedor);
      })
    });
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
