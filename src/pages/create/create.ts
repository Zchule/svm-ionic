import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';

import { DataService } from '../../providers/data.service';

import { Geolocation} from '@ionic-native/geolocation';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {

  preventaForm: FormGroup;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public geolocation: Geolocation
    ) {
      this.preventaForm = this.makeForm();    
  }

  ionViewDidLoad() {
    this.getPosition();
  }

  savePreventa( event: Event ){
    event.preventDefault();
      let photo = "assets/imgs/sinfoto.png";
      let fecha = firebase.database.ServerValue.TIMESTAMP;
      let data = this.preventaForm.value; 
      data.photo = photo;
      data.fecha = fecha;
      this.dataService.create(data);
      let message = this.toastCtrl.create({
      message: 'Dato Registrado',
      duration: 3000,
      showCloseButton: true
    })
    message.present();
    this.close();
    this.preventaForm = this.makeForm();
  }
  
  getPosition(): any {
    let msn = "No Encontramos su ubicacion, revise su internet o su Gps";
    this.geolocation.getCurrentPosition().then((position) => {
    this.preventaForm.get('latitude').setValue(position.coords.latitude);
    this.preventaForm.get('longitude').setValue(position.coords.longitude);
    
  }).catch((error) => {
              let alert = this.alertCtrl.create({
               title: "ERROR GPS",
               message: msn,
               buttons: [
                 {
                   text: "Ok",
                   role: 'cancel'
                 }
               ]
             });
             alert.present();
    });
  }
  
  makeForm(){
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      apPat: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]]
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
