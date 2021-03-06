import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from 'src/app/modules/tab3/tab3.page';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';

import { Tab3PageRoutingModule } from 'src/app/modules/tab3/tab3-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [Tab3Page],
  providers: [
  ],
})
export class Tab3PageModule {}
