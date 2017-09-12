import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

@Injectable()
export class LoginService {

  supervisores: FirebaseListObservable<any>;
  supervisoresRef: firebase.database.Query;

  userState: BehaviorSubject<any>;

  constructor(
    public fireDatabase: AngularFireDatabase,
    public afoDatabase: AngularFireOfflineDatabase
  )
   {
    this.supervisores = this.fireDatabase.list('/Supervisores');
    this.supervisoresRef = this.supervisores.$ref;
    this.userState = new BehaviorSubject(this.getUser());
  }

  doLogin(usuario: string, password: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      const query = this.supervisoresRef.orderByChild('NombreUsuario').equalTo(usuario);
      query.once('value', snap =>{
        let data = "";
        snap.forEach(item => {
          data = item.key ;
          this.getSupervisor(item.key).then( user=> {
            if(user.NombreUsuario == usuario && user.Contraseña == password ){
              console.log(user);
              this.saveUser(user);
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
  
  saveUser(newUser: any): void{
    localStorage.setItem('current-user', JSON.stringify(newUser));
  }

  getUser(): any{
    let user = localStorage.getItem('current-user');
    if(user !== null && user !== undefined){
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return (this.getUser() !== null);
  }

  logout(){
    localStorage.clear();
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
