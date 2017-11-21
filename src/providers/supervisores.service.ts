// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SupervisoresProvider {

  getSupervisorAllRef: BehaviorSubject<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private fireDatabase: AngularFireDatabase,
    // private http: HttpClient,
    private storage: Storage,
    private network: Network,
    private platform: Platform
  ) {
    console.log('Hello SupervisoresProvider Provider');
    this.getSupervisorAllRef = new BehaviorSubject(null);
  }

  getSupervisor(id: string) {
    return this.fireDatabase.object('/Supervisores/' + id);
  }

  getFechaServidor() {
    return this.fireDatabase.object('/Servidor');
  }

  getSupervisorAllOnline(id: string, fecha): void {
    console.log('getVendedorAllOnline', id);
    const supervisoresListRef = this.fireDatabase.list(`/Supervisores/${id}/SupervisoresList`);
    const supervisoresListSubscription = supervisoresListRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        const supervisor = action.payload.val();
        supervisor.hora = '00:00:00';
        this.getSupervisorAllRef.next(supervisor);
        // hora
        const horaRef = this.fireDatabase.object(`/trackingSupervisor/${supervisor.imei}/PosicionActual/hora`);
        const horaSubscription = this.createHoraSubscription(horaRef, supervisor);
        this.subscriptions.push( horaSubscription );
      });
    });
    this.subscriptions.push( supervisoresListSubscription );
  }

  private createHoraSubscription(horaRef, supervisor) {
    return horaRef.valueChanges()
    .subscribe( hora => {
      if (hora !== null) {
        supervisor.hora = hora;
        this.getSupervisorAllRef.next(supervisor);
      }
    });
  }

  stopGetSupervisorAllOnline() {
    console.log('stopGetVendedorAllOnline', this.subscriptions.length);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getSupervisorAllOffline(id: string): void {
    console.log('getSupervisorAllOffline');
    this.storage.get('SupervisorList')
    .then(data => {
      const supervisoresOffline = JSON.parse(data);
      console.log('list ofline servicio', supervisoresOffline);
      Object.keys(supervisoresOffline).forEach(key => {
        this.getSupervisorAllRef.next(supervisoresOffline[key]);
      });
    });
  }

  getSupervisorAll(id: string, fecha): void {
    if (this.platform.is('cordova')) {
      if (this.network.type !== 'none') {
        console.log('entro con inter', this.network.type);
        this.getSupervisorAllOnline(id, fecha);
      } else {
        console.log('entro a none', this.network.type);
        this.getSupervisorAllOffline(id);
      }
     } else {
      this.getSupervisorAllOnline(id, fecha);
    }
  }

  getSupervisorAllChannel() {
    return this.getSupervisorAllRef.asObservable();
  }

  getSupervisorMap(id: string, fecha: string) {
    // console.log('getVendedor');
    const vendedorRef = this.fireDatabase
    // .list(`/vendedores/${id}/registro:${fecha}/geoPuntoList`, ref => ref.limitToLast(500));
    .list(`/trackingSupervisor/${id}/registro:${fecha}/geoPuntoList`);
    // return vendedorRef.stateChanges();
    return vendedorRef.snapshotChanges(['child_added']);
  }

  getSupervisorPosicionActual(id: string) {
    // console.log('getVendedorPosicionActual');
    const vendedorRef = this.fireDatabase.object(`/trackingSupervisor/${id}/PosicionActual`);
    return vendedorRef.valueChanges();
  }

}
