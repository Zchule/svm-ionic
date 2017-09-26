import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

import * as firebase from 'firebase';

@Injectable()
export class LoginService {

  supervisores: FirebaseListObservable<any>;
  supervisoresRef: firebase.database.Query;
  getVendedorAllOnlineRealtimeRef: BehaviorSubject<any>;
  userChannel: BehaviorSubject<any>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    private storage: Storage,
    private network: Network,
    private platform: Platform
  ) {
    this.supervisores = this.fireDatabase.list('/Supervisores');
    this.supervisoresRef = this.supervisores.$ref;
    this.getVendedorAllOnlineRealtimeRef = new BehaviorSubject(null);
    this.userChannel = new BehaviorSubject(null);
  }

  searchImei(imei: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = this.supervisoresRef.orderByKey().equalTo(imei);
      query.once('value', snap => {
        const user = snap.val()[imei];
        console.log(user.operacionId);
        if (user.operacionId === 1) {
          resolve(user);
        }else {
          reject(user);
        }
      });
    });
  }

  doLoginOnline(usuario: string, password: string, imei: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = this.supervisoresRef.orderByKey().equalTo(imei);
      query.once('value', snap => {
        const user = snap.val()[imei];
        if (user.NombreUsuario === usuario && user.Contraseña === password && user.operacionId === 1 ) {
          this.getVendedorAllOnline(imei);
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
    console.log(usuario, password);
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
        console.log('login off', estado);
        return this.doLoginOffline(usuario, password);
      }else {
        console.log('login on', estado);
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

  getVendedorAllOnline(id: string) {
    console.log('entro Online');
    const vendedores = [];
    let sizeVendedores = 0;
    return new Promise((resolve, reject) => {
      this.fireDatabase.list('/Supervisores/' + id + '/VendedoresList')
      .subscribe(list => {
        console.log(list);
        sizeVendedores = list.length;
        list.forEach(vendedor => {
          const imei = vendedor.imei;
          const nombre = vendedor.nombreVendedor;
          this.fireDatabase.object('/vendedores/' + imei)
          .subscribe(dataVendedor => {
            dataVendedor.nombreVendedor = nombre;
            vendedores.push(dataVendedor);
            if (vendedores.length === sizeVendedores) {
              const dataoffline = JSON.stringify(vendedores);
              this.storage.set('vendedoresList', dataoffline);
              console.log(vendedores);
              resolve(vendedores);
            }
          });
        });
      });
    });
  }

  getVendedorAllOffline(id: string) {
    console.log('entro Offline');
    return this.storage.get('vendedoresList')
    .then(data => {
      const dataoffline = JSON.parse(data);
      console.log("listOff", dataoffline);
      return Promise.resolve(dataoffline);
    });
  }

  getVendedorAll(id: string) {
    if (this.platform.is('cordova')) {
      console.log(this.network.type);
      if (this.network.type !== 'none') {
        console.log(this.network.type);
        return this.getVendedorAllOnline(id);
      }else {
        return this.getVendedorAllOffline(id);
      }
     } else {
      return this.getVendedorAllOnline(id);
    }
  }

  getVendedorAllOnlineRealtime(id: string) {
    this.fireDatabase.list('/Supervisores/' + id + '/VendedoresList')
    .subscribe(list => {
      list.forEach(vendedor => {
        const imei = vendedor.imei;
        const nombre = vendedor.nombreVendedor;
        this.fireDatabase.object('/vendedores/' + imei)
        .subscribe(dataVendedor => {
          dataVendedor.nombreVendedor = nombre;
          console.log(dataVendedor);
          dataVendedor.imei = imei;
          this.getVendedorAllOnlineRealtimeRef.next(dataVendedor);
        });
      });
    });
  }

  getVendedorAllOnlineRealtimeoOb() {
    return this.getVendedorAllOnlineRealtimeRef.asObservable();
  }

  getUserChannel() {
    return this.userChannel.asObservable();
  }

}
