import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListSupervidoresPage } from './list-supervidores';

@NgModule({
  declarations: [
    ListSupervidoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ListSupervidoresPage),
  ],
})
export class ListSupervidoresPageModule {}
