import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { SQLite } from '@ionic-native/sqlite';
import { SqlService } from '../../providers/sql.service';

@IonicPage()
@Component({
  selector: 'page-list-user',
  templateUrl: 'list-user.html',
})
export class ListUserPage {

  users: any[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public sqlService: SqlService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListUserPage');
  }

  addUser(){
    let modal = this.modalCtrl.create('CreateUserPage');
    modal.present();
  }

  getAllUsers(){
    this.sqlService.getAll()
    .then(users => {
      this.users = users;
    })
    .catch( error => {
      console.error( error );
    });
  }

}
