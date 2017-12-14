import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapSupervisorPage } from './map-supervisor';

@NgModule({
  declarations: [
    MapSupervisorPage,
  ],
  imports: [
    IonicPageModule.forChild(MapSupervisorPage),
  ],
})
export class MapSupervisorPageModule {}
