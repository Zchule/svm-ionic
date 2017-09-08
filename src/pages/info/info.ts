import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

  close(){
    
    this.viewCtrl.dismiss();
  }

}
