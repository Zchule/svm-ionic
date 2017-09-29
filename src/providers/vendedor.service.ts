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
    return this.http.get('https://firebase.google.com/')
    .map(res => res.status)
    .toPromise();
  }

  getVendedorAllOnline(id: string): void {
    console.log('getVendedorAllOnline');
    this.fireDatabase.database.ref(`/Supervisores/${id}/VendedoresList`)
    .on('child_added', dataSnapshot => {
      const vendedor = dataSnapshot.val();
      const nombre = vendedor.nombreVendedor;
      this.fireDatabase.database.ref(`/vendedores/${vendedor.imei}`)
      .on('value', dataSnapshot => {
        const dataVendedor = dataSnapshot.val();
        dataVendedor.nombreVendedor = nombre;
        dataVendedor.key = dataSnapshot.key;
        this.getVendedorAllRef.next(dataVendedor);
      });
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

  getVendedorAll(id: string): void {
    if (this.platform.is('cordova')) {
      if (this.network.type !== 'none') {
        this.getVendedorAllOnline(id);
      }else {
        this.getVendedorAllOffline(id);
      }
     } else {
      this.getVendedorAllOnline(id);
    }
  }

  getVendedorAllChannel() {
    return this.getVendedorAllRef.asObservable();
  }

}
