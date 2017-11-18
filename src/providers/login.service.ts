import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
// import { Network } from '@ionic-native/network';
import { Md5 } from 'ts-md5/dist/md5';
// import { Subscription } from 'rxjs/Subscription';

// import { VendedorService } from './../providers/vendedor.service';

@Injectable()
export class LoginService {

  supervisores: any;
  // supervisoresRef: firebase.database.Query;
  getVendedorAllOnlineRealtimeRef: BehaviorSubject<any>;
  userChannel: BehaviorSubject<any>;
  vendedorChannel: BehaviorSubject<any>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    private storage: Storage
  ) {
    this.userChannel = new BehaviorSubject(null);
    this.vendedorChannel = new BehaviorSubject(null);
  }

  doLogin(usuario: string, password: string, imei: string): Promise<any> {
    console.log(usuario, password);
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

  doLoginOnline(usuario: string, password: string, imei: string): Promise<any> {
    console.log(usuario, password, imei);
    return new Promise((resolve, reject) => {
      const query = this.fireDatabase.database.ref('/Supervisores').orderByKey().equalTo(imei);
      query.once('value', snap => {
        const user = snap.val()[imei];
        console.log(user);
        let pages: any = {
          'supervisor': 'HomePage',
          'jventas': 'HomeJefeVentasPage',
        };
        user.page = pages[user.tipo];
        if (user.NombreUsuario === usuario && user.Contraseña === password && user.operacionId === 1 ) {
          // this.vendedorService.getVendedorAllOffline(imei);
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
      const passwordEncrip = Md5.hashStr(password);
      console.log(passwordEncrip);
      if (userOff.NombreUsuario === usuario && userOff.Contraseña === passwordEncrip) {
        return Promise.resolve(userOff);
      }else {
        return Promise.reject(userOff);
      }
    });
  }

  getAll() {
    return this.supervisores;
  }

  getUserChannel() {
    return this.userChannel.asObservable();
  }

}
