import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapGenericPage } from './map-generic';

@NgModule({
  declarations: [
    MapGenericPage,
  ],
  imports: [
    IonicPageModule.forChild(MapGenericPage),
  ],
})
export class MapGenericPageModule {}
