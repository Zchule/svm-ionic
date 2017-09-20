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

  getFechaServidor(){
    return this.fireDatabase.object('/Servidor');
 }

//  getListVendedoresActual(id, fecha): Promise<any>{
//   let fechaA = '09-20-17';
//   console.log("entro Online");
//   let vendedores = [];
//   let sizeVendedores = 0;
//   return new Promise((resolve, reject)=>{
//     this.fireDatabase.list('/Supervisores/'+ id + '/VendedoresList')
//     .subscribe(list=>{
//       console.log(list);
//       sizeVendedores = list.length;
//       list.forEach(vendedor=>{
//         let imei = vendedor.imei;
//         let nombre = vendedor.nombreVendedor;
//         this.fireDatabase.object('/vendedores/')
//         .subscribe(data=>{
//             console.log(data);
//             resolve(data);
//         })
//       })
//     })
//   });
// }

}
