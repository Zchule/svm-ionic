import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class VendedorService {

  vendedores: FirebaseListObservable<any>;
  vendedoresRef: firebase.database.Query;

  constructor(
    public fireDatabase: AngularFireDatabase,
    public http: Http
  ) {
    this.vendedores = this.fireDatabase.list('/vendedores');
    this.vendedoresRef = this.vendedores.$ref;
  }

  getVendedorAll() {
    return this.vendedores;
  }

  getVendedor(id: string) {
    return this.fireDatabase.object('/vendedores/' + id);
  }

  getFechaServidor() {
    return this.fireDatabase.object('/Servidor');
 }

 getConexion() {
    return this.http.get('https://firebase.google.com/')
    .map(res => res.status)
    .toPromise();
}

//  getGeoListChannel(imei, fecha){
//    this.fireDatabase.database.ref('/vendedores/'+ imei + '/registro:'+ fecha + '/geoPuntoList' )
//    .on('child_added', data=>{
//     console.log(data.val());
//    })
//   return this.fireDatabase.list('/vendedores/'+ imei + '/registro:'+ fecha + '/geoPuntoList' )
// }

}
