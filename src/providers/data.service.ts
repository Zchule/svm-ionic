import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase';

@Injectable()
export class DataService {

  datos: FirebaseListObservable<any>;
  datosRef: firebase.database.Query;
 
  constructor(
    public fireDatabase: AngularFireDatabase
    ) {
    this.datos = this.fireDatabase.list('/datos');
    this.datosRef = this.datos.$ref;
  }
  getAll(){
    return this.datos;
  }

  create(dato){
    this.datos.push(dato);
  }
  getOrder(id){
    return this.fireDatabase.object('/datos/'+ id);
  }

}
