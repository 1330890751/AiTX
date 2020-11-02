import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MePage } from 'src/app/modules/me/me.page';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';

import { MePageRoutingModule } from '@app/modules/me/me-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MePageRoutingModule
  ],
  declarations: [MePage]
})
export class MePageModule {}
