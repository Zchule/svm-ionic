import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase';

@Injectable()
export class VendedorService {

  vendedores: FirebaseListObservable<any>;
  vendedoresRef: firebase.database.Query;

  constructor(
    public fireDatabase: AngularFireDatabase
  ) {
    this.vendedores = this.fireDatabase.list('/vendedores');
    this.vendedoresRef = this.vendedores.$ref;
  }

  getVendedorAll(){
    return this.vendedores;
  }

  getVendedor(id){
    return this.fireDatabase.object('/vendedores/'+ id);
  }

  getRegistro(id){
     return this.fireDatabase.object('/vendedores/'+ id + '/registro:09-19-2017' + '/geoPuntoList');
  }

  getFechaServidor(){
    return this.fireDatabase.object('/Servidor');
 }

}
