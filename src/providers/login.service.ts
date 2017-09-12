import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import * as firebase from 'firebase';

@Injectable()
export class LoginService {

  supervisores: FirebaseListObservable<any>;
  supervisoresRef: firebase.database.Query;

  constructor(
    public fireDatabase: AngularFireDatabase,
    public afoDatabase: AngularFireOfflineDatabase
  )
   {
    this.supervisores = this.fireDatabase.list('/Supervisores');
    this.supervisoresRef = this.supervisores.$ref;
  }

  doLogin(usuario: string, password: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      const query = this.supervisoresRef.orderByChild('NombreUsuario').equalTo(usuario);
      query.once('value', snap =>{
        let data = "";
        snap.forEach(item => {
          data = item.key ;
          this.getUser(item.key).then( user=> {
            if(user.NombreUsuario == usuario && user.Contraseña == password ){
              console.log(user);
              resolve(user);
            }else{
              reject(user);
            }  
          }).catch(error => Promise.reject(error))
          return false;    
        });
      })
    })
  }
  
  getUser(id: string): Promise<any>{
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

  getVendedorAll(id){
    let vendedores = [];
    let sizeVendedores = 0;
    return new Promise((resolve, reject)=>{
      this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList')
      .subscribe(list=>{
        sizeVendedores = list.length;
        list.forEach(vendedor=>{
          let imei = vendedor.imei;
          let nombre = vendedor.nombreVendedor;
          this.fireDatabase.object('/vendedores/'+ imei)
          .subscribe(dataVendedor=>{
            dataVendedor.nombreVendedor = nombre;
            vendedores.push(dataVendedor);
            if(vendedores.length == sizeVendedores){
              resolve(vendedores);
            }
          })
        })
      })
    });
  }

  getListVendedores(id){
    return this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList');
  }

}
