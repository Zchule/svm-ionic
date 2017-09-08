import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { SqlService } from '../../providers/sql.service';

@IonicPage()
@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {

  createForm: FormGroup;
  create: any= null;


  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public sqlService: SqlService,
    public toastCtrl: ToastController
  ) 
  {
    this.createForm = this.makeForm(); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateUserPage');
  }

  saveUser( event: Event ){
    event.preventDefault();
    let photo = "assets/imgs/sinfoto.png";
    let data = this.createForm.value; 
    data.photo = photo;
    this.sqlService.create(data);
    let message = this.toastCtrl.create({
    message: 'Dato Registrado',
    duration: 3000,
    showCloseButton: true
  })
  message.present();
  this.close();
  this.createForm = this.makeForm();
  }
  
  makeForm(){
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      apPat: ['', [Validators.required]]
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
