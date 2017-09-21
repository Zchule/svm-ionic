import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, MenuController} from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';
import { LoginService } from '../../providers/login.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  supervisores: FirebaseListObservable<any>;
  data: any [];
  userName: "";
  imeiCel: string;

    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public formBuilder: FormBuilder,
      public alertCtrl: AlertController, 
      public loadingCtrl: LoadingController,
      public menuCtrl: MenuController,
      public modalCtrl: ModalController,
      public loginService: LoginService,
      private storage: Storage
    ) {
      this.loginForm = this.makeLoginForm();
    }

    ionViewDidLoad() {
      // this.storage.get('user')
      // .then(user=>{
      //   let userOff = JSON.parse(user);
      //   this.userName = userOff.NombreUsuario;
      //   console.log(userOff);
      // })
    }
    
    ionViewDidEnter() {
      this.menuCtrl.enable(false, 'menuAdmin');
    } 
    
    nombre(userName){
      this.loginForm.value.usuario = userName;
    }
    
    info(){
      let modal = this.modalCtrl.create('InfoPage');
      modal.present();
    }

    doLogin( event: Event){
      event.preventDefault();
      let load = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      let usuario = this.loginForm.value.usuario;
      let password = this.loginForm.value.password;
      // this.storage.get('imei')
      // .then(imei=>{
      //   console.log('imei llego', imei)
      // this.imeiCel = imei;
      this.imeiCel='357815085654648';
        this.loginService.doLogin(usuario, password, this.imeiCel)
        .then( usuario => {
          this.navCtrl.setRoot("HomePage");
        })
        .catch(error =>{
          load.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            title: 'Datos Invalidos',
            subTitle: 'Revise sus datos',
            buttons: ['OK']
          });
          alert.present();
          });
        });
      // })

    }
  
    private makeLoginForm(){
      return this.formBuilder.group({
        usuario: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  
  }
