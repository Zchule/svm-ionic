import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MapService {

  constructor(
    private fireDatabase: AngularFireDatabase,
  ) {}

  getFechaServidor() {
    return this.fireDatabase.object('/Servidor');
  }

  getVendedor(id: string, fecha: string) {
    // console.log('getVendedor');
    const vendedorRef = this.fireDatabase
    // .list(`/vendedores/${id}/registro:${fecha}/geoPuntoList`, ref => ref.limitToLast(500));
    .list(`/vendedores/${id}/registro:${fecha}/geoPuntoList`);
    // return vendedorRef.stateChanges();
    return vendedorRef.snapshotChanges(['child_added']);
  }

  getVendedorPosicionActual(id: string) {
    // console.log('getVendedorPosicionActual');
    const vendedorRef = this.fireDatabase.object(`/vendedores/${id}/PosicionActual`);
    return vendedorRef.valueChanges();
  }

  runSimulation(id: string, fecha: string) {
    console.log('runSimulation');
    const vendedorRef = this.fireDatabase.list(`/vendedores/${id}/registro:${fecha}/geoPuntoList`);
    setInterval(() => {
      console.log('add point');
      vendedorRef.push({
        tipo: 'VENTA',
        nombreCliente: 'Nicolas',
        clientId: '3',
        ...this.generatePoint()
      });
    }, 5000);
  }

  private generatePoint(latitude = -16.5027173, longitude= -68.1353874) {
    return {
      latitud: latitude + Math.random() * (1 - (-1)) + (-1),
      longitud: longitude + Math.random() * (1 - (-1)) + (-1),
    };
  }


}
