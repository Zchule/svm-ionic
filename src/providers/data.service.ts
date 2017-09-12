import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import * as firebase from 'firebase';

@Injectable()
export class DataService {

  vendedores: FirebaseListObservable<any>;
  vendedoresRef: firebase.database.Query;
  public usuarios: AfoListObservable<any[]>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    public afoDatabase: AngularFireOfflineDatabase
    ) {
    this.vendedores = this.fireDatabase.list('/vendedores');
    this.vendedoresRef = this.vendedores.$ref;
    
  }
  getAll(){
    return this.vendedores;
  }

  create(vendedor){
    this.vendedores.push(vendedor);
  }

  getVendedor(id){
    return this.fireDatabase.object('/vendedores/'+ id);
  }

  getVendedoresByFecha(fecha: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      const query = this.vendedoresRef.orderByChild('fecha').equalTo(fecha);
      console.log(query);
      query.once('value', snap =>{
        let orders = [];
        snap.forEach(item => {
          let data = item.val();
          console.log(data);
          data.key = item.key;
          orders.push(data);
          return false;
        });
        if(orders === null){
          reject(orders);
        }else{
          resolve(orders);
        }
      })
    })
  }


}
