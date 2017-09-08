import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, MenuController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loginForm: FormGroup;
  
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public formBuilder: FormBuilder,
      public alertCtrl: AlertController, 
      public loadingCtrl: LoadingController,
      public menuCtrl: MenuController,
      public modalCtrl: ModalController
    ) {
      this.loginForm = this.makeLoginForm();
    }

    ionViewDidEnter() {
      this.menuCtrl.enable(false, 'menuAdmin');
    }

    info(){
      let modal = this.modalCtrl.create('InfoPage');
      modal.present();
    }
    
    doLogin( event: Event ){
      event.preventDefault();
  
      let usuario = this.loginForm.value.usuario;
      let password = this.loginForm.value.password;
      if(usuario == "admin" && password == "123456"){
        this.navCtrl.setRoot("AdmSuperPage");
      }else{ 
        let alert = this.alertCtrl.create({
          title: "Datos Invalidos",
          message: "Revise sus Datos",
          buttons: [{
            text: "Ok",
            role: 'cancel'
          }]
        });
        alert.present();
      }

    }
  
    private makeLoginForm(){
      return this.formBuilder.group({
        usuario: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  
  }
