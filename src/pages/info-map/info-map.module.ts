import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoMapPage } from './info-map';

@NgModule({
  declarations: [
    InfoMapPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoMapPage),
  ],
})
export class InfoMapPageModule {}
