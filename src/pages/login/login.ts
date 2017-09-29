import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, MenuController} from 'ionic-angular';

import { LoginService } from '../../providers/login.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  data: any [];
  userName: string;
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
    this.storage.get('user')
    .then(user => {
      const usuario = JSON.parse(user);
      if (usuario) {
        this.loginForm.patchValue({usuario: usuario.NombreUsuario});
      }
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'menuAdmin');
  }

  nombre(userName) {
    this.loginForm.value.usuario = userName;
  }

  info() {
    const modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }

  doLogin(event: Event) {
    event.preventDefault();
    const load = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    
    const usuario = this.loginForm.value.usuario;
    const password = this.loginForm.value.password;
    // this.storage.get('imei')
    // .then(imei=>{
    //   console.log('imei llego', imei)
    // this.imeiCel = imei;
    this.imeiCel = '358239057387500';
    this.loginService.doLogin(usuario, password, this.imeiCel)
    .then(() => {
      this.navCtrl.setRoot('HomePage');
    })
    .catch(error => {
      load.dismiss()
      .then(() => {
        const alert = this.alertCtrl.create({
          title: 'Datos Invalidos',
          subTitle: 'Revise sus datos',
          buttons: ['OK']
        });
        alert.present();
      });
    });
  // })

  }

  private makeLoginForm() {
    return this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

}
