import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MapGenericService {

  subscriptions: Subscription[] = [];
  getVendedoresChannel: BehaviorSubject<any>;

  constructor(
    private fireDatabase: AngularFireDatabase,
  ) {
    this.getVendedoresChannel = new BehaviorSubject(null);
  }

  getFechaServidor() {
    return this.fireDatabase.object('/Servidor');
  }

  getVendedoresMapGeneric(id: string, fecha): void {
    console.log('getVendedoresMapGeneric');
    const vendedoresListRef = this.fireDatabase.list(`/Supervisores/${id}/VendedoresList`);
    const vendedoresListSubscription = vendedoresListRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        const vendedor = action.payload.val();
        // PosicionActual
        const posicionActualRef = this.fireDatabase.object(`/vendedores/${vendedor.imei}/PosicionActual`);
        const horaSubscription = this.createPosicionActualSubscription(posicionActualRef, vendedor);
        this.subscriptions.push( horaSubscription );
      });
    });
    this.subscriptions.push( vendedoresListSubscription );
  }

  private createPosicionActualSubscription(posicionActualRef, vendedor) {
    return posicionActualRef.valueChanges()
    .subscribe( posicionActual => {
      if (posicionActual !== null) {
        vendedor.posicionActual = posicionActual;
        this.getVendedoresChannel.next(vendedor);
      }
    });
  }

  stopGetVendedorMapGeneric() {
    console.log('stopGetVendedorMapGeneric', this.subscriptions.length);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  getVendedoresChannelOb() {
    return this.getVendedoresChannel.asObservable();
  }

}
