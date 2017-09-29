import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { Subscription } from 'rxjs/Subscription';

import { VendedorService } from './../providers/vendedor.service';

@Injectable()
export class LoginService {

  supervisores: FirebaseListObservable<any>;
  supervisoresRef: firebase.database.Query;
  getVendedorAllOnlineRealtimeRef: BehaviorSubject<any>;
  userChannel: BehaviorSubject<any>;
  vendedorChannel: BehaviorSubject<any>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    private storage: Storage,
    private network: Network,
    private platform: Platform,
    private vendedorService: VendedorService
  ) {
    this.supervisores = this.fireDatabase.list('/Supervisores');
    this.supervisoresRef = this.supervisores.$ref;
    this.getVendedorAllOnlineRealtimeRef = new BehaviorSubject(null);
    this.userChannel = new BehaviorSubject(null);
    this.vendedorChannel = new BehaviorSubject(null);
  }

  doLoginOnline(usuario: string, password: string, imei: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = this.supervisoresRef.orderByKey().equalTo(imei);
      query.once('value', snap => {
        const user = snap.val()[imei];
        if (user.NombreUsuario === usuario && user.Contraseña === password && user.operacionId === 1 ) {
          this.vendedorService.getVendedorAllOffline(imei);
          user.Contraseña = Md5.hashStr(user.Contraseña);
          const userOff = JSON.stringify(user);
          this.storage.set('user', userOff);
          this.storage.set('offline', true);
          this.userChannel.next(user);
          resolve(user);
        }else {
          reject(user);
        }
      });
    });
  }

  doLoginOffline(usuario: string, password: string): Promise<any> {
    return this.storage.get('user')
    .then(user => {
      const userOff = JSON.parse(user);
      this.userChannel.next(userOff);
      console.log(userOff.NombreUsuario, userOff.Contraseña);
      let passwordEncrip = Md5.hashStr(password);
      console.log(passwordEncrip);
      if (userOff.NombreUsuario === usuario && userOff.Contraseña === passwordEncrip) {
        return Promise.resolve(userOff);
      }else{
        return Promise.reject(userOff);
      }
    });
  }

  doLogin(usuario: string, password: string, imei: string): Promise<any> {
    return this.storage.get('offline')
    .then(estado => {
      if (estado) {
        console.log('login offline', estado);
        return this.doLoginOffline(usuario, password);
      }else {
        console.log('login online', estado);
        return this.doLoginOnline(usuario, password, imei);
      }
    });
  }

  getSupervisor(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireDatabase.object('/Supervisores/' + id)
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAll() {
    return this.supervisores;
  }

  

  getVendedorAllOnlineRealtime(id: string) {
    this.fireDatabase.database.ref(`/Supervisores/${id}/VendedoresList`)
    .on('child_added', dataSnapshot => {
      const vendedor = dataSnapshot.val();
      const nombre = vendedor.nombreVendedor;
      this.fireDatabase.database.ref(`/vendedores/${vendedor.imei}/PosicionActual`)
      .on('value', dataSnapshot => {
        const posicionActual = dataSnapshot.val();
        posicionActual.nombreVendedor = nombre;
        posicionActual.imei = vendedor.imei;
        this.getVendedorAllOnlineRealtimeRef.next(posicionActual);
      });
    });
  }

  getVendedorAllOnlineRealtimeoOb() {
    return this.getVendedorAllOnlineRealtimeRef.asObservable();
  }

  getUserChannel() {
    return this.userChannel.asObservable();
  }

  getVendedor(imei, fecha){
    const vendedores = [];
    this.fireDatabase.object('/vendedores/' + imei + '/registro:'+ fecha )
    .subscribe(data => {
      console.log(data);
      vendedores.push(data);
      this.vendedorChannel.next(data);
    })
  }
  
  getVendedorChannel() {
    return this.vendedorChannel.asObservable();
  }

}
