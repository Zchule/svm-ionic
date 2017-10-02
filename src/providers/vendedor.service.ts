import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VendedorService {

  getVendedorAllRef: BehaviorSubject<any>;
  subscriptions: Subscription[] = [];

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
    // return this.http.get('https://firebasestorage.googleapis.com/v0/b/svmmoviltest.appspot.com/o/check-conexion.json?alt=media&token=4069678c-c030-4853-be60-c299f597c021')
    // .map(res => res.json())
    // .toPromise();
  }

  getVendedorAllOnline(id: string, fecha): void {
    console.log('getVendedorAllOnline');
    const vendedoresListRef = this.fireDatabase.list(`/Supervisores/${id}/VendedoresList`);
    const vendedoresListSubscription = vendedoresListRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        const vendedor = action.payload.val();
        vendedor.efectividad = 0;
        vendedor.hora = '00:00:00';
        this.getVendedorAllRef.next(vendedor);
        // hora
        const horaRef = this.fireDatabase.object(`/vendedores/${vendedor.imei}/PosicionActual/hora`);
        const horaSubscription = this.createHoraSubscription(horaRef, vendedor);
        this.subscriptions.push( horaSubscription );
        // efectividad
        const efectividadRef = this.fireDatabase.object(`/vendedores/${vendedor.imei}/registro:${fecha}/efectividad`);
        const efectividadSubscription = this.createEfectividadSubscription(efectividadRef, vendedor);
        this.subscriptions.push( efectividadSubscription );
      });
    });
    this.subscriptions.push( vendedoresListSubscription );
  }

  private createHoraSubscription(horaRef, vendedor) {
    return horaRef.valueChanges()
    .subscribe( hora => {
      console.log('hora', hora);
      if (hora !== null) {
        vendedor.hora = hora;
        this.getVendedorAllRef.next(vendedor);
      }
    });
  }

  private createEfectividadSubscription(efectividadRef, vendedor) {
    return efectividadRef.valueChanges()
    .subscribe( efectividad => {
      console.log('efectividad', efectividad);
      if (efectividad !== null) {
        vendedor.efectividad = efectividad;
        this.getVendedorAllRef.next(vendedor);
      }
    });
  }

  stopGetVendedorAllOnline() {
    console.log('stopGetVendedorAllOnline', this.subscriptions.length);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getVendedorAllOffline(id: string): void {
    console.log('getVendedorAllOffline');
    this.storage.get('vendedoresList')
    .then(data => {
      const vendedoresOffline = JSON.parse(data);
      Object.keys(vendedoresOffline).forEach(key => {
        this.getVendedorAllRef.next(vendedoresOffline[key]);
      });
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
