import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapNativoPage } from './map-nativo';

@NgModule({
  declarations: [
    MapNativoPage,
  ],
  imports: [
    IonicPageModule.forChild(MapNativoPage),
  ],
})
export class MapNativoPageModule {}
