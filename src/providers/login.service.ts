import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

import * as firebase from 'firebase';

@Injectable()
export class LoginService {

  supervisores: FirebaseListObservable<any>;
  supervisoresRef: firebase.database.Query;
  getVendedorAllOnlineRealtimeRef:BehaviorSubject<any>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    private storage: Storage,
    private network: Network,
    private platform: Platform
  )
   {
    this.supervisores = this.fireDatabase.list('/Supervisores');
    this.supervisoresRef = this.supervisores.$ref;
    this.getVendedorAllOnlineRealtimeRef = new BehaviorSubject(null);
  }

  doLoginOnline(usuario: string, password: string, imei: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      const query = this.supervisoresRef.orderByKey().equalTo('357815085654648');
      query.once('value', snap =>{
        let user = snap.val()['357815085654648'];
        console.log(user.NombreUsuario, user.Contraseña);
        console.log(user);
        console.log(usuario, password);
        if(user.NombreUsuario == usuario && user.Contraseña == password ){
          // this.getVendedorAllOnline('357815085654648');
          let userOff = JSON.stringify(user)
          this.storage.set('user', userOff);
          this.storage.set('offline', true);
          resolve(user);
        }else{
          reject(user);
        }   
      })
    })
  }

  doLoginOffline(usuario: string, password: string): Promise<any>{
    return this.storage.get('user')
    .then(user=>{
      let userOff = JSON.parse(user);
      if(userOff.NombreUsuario == usuario && userOff.Contraseña == password){
        return Promise.resolve(userOff);
      }
    })
  }

  doLogin(usuario: string, password: string, imei: string): Promise<any>{
    return this.storage.get('offline')
    .then(estado =>{
      if(estado){
        console.log("login off", estado);
        return this.doLoginOffline(usuario, password);
      }else{
        console.log("login on", estado);
        return this.doLoginOnline(usuario, password, imei)
      }
    })
  }

  getSupervisor(id: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      this.fireDatabase.object('/Supervisores/'+ id)
      .subscribe(data =>{
        resolve(data);
      },error=>{
        reject(error)
      })
    })
  }

  getAll(){
    return this.supervisores;
  }

  getVendedorAllOnline(id){
    console.log("entro Online");
    let vendedores = [];
    let sizeVendedores = 0;
    id = '357815085654648';
    return new Promise((resolve, reject)=>{
      this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList')
      .subscribe(list=>{
        console.log(list);
        sizeVendedores = list.length;
        list.forEach(vendedor=>{
          let imei = vendedor.imei;
          let nombre = vendedor.nombreVendedor;
          this.fireDatabase.object('/vendedores/'+ imei)
          .subscribe(dataVendedor=>{
            dataVendedor.nombreVendedor = nombre;
            vendedores.push(dataVendedor);
            if(vendedores.length == sizeVendedores){
              let dataoffline = JSON.stringify(vendedores);
              this.storage.set("vendedoresList", dataoffline);
              console.log(vendedores);
              resolve(vendedores);
            }
          })
        })
      })
    });
  }

  getVendedorAllOffline(id){
    console.log("entro Offline");
    return this.storage.get("vendedoresList")
    .then(data=>{
      let dataoffline = JSON.parse(data);
      return Promise.resolve(dataoffline);
    })
  }

  getVendedorAll(id){
    if(this.platform.is('cordova')){
      console.log(this.network.type); 
      if(this.network.type !== "none"){
        console.log(this.network.type); 
        return this.getVendedorAllOnline(id);
      }else{
        return this.getVendedorAllOffline(id);
      }
    }else{
      return this.getVendedorAllOnline(id);
    }
    
  }

  getListVendedores(id){
    return this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList');
  }
  getVendedorAllOnlineRealtime(id){
    id = '357815085654648';
    this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList')
    .subscribe(list=>{
      list.forEach(vendedor=>{
        const imei = vendedor.imei;
        let nombre = vendedor.nombreVendedor;
        this.fireDatabase.object('/vendedores/'+ imei)
        .subscribe(dataVendedor=>{
          dataVendedor.nombreVendedor = nombre;
          console.log(dataVendedor);
          dataVendedor.imei = imei;
          this.getVendedorAllOnlineRealtimeRef.next(dataVendedor);
        })
      })
    })
  }

  getVendedorAllOnlineRealtimeoOb(){
    return this.getVendedorAllOnlineRealtimeRef.asObservable();
  }

}
