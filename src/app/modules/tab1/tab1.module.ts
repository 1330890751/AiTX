import { NgModule } from '@angular/core';
import { Tab1Page } from 'src/app/modules/tab1/tab1.page';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';
import { SharedModule } from '@shared/shared.module';

import { Tab1PageRoutingModule } from 'src/app/modules/tab1/tab1-routing.module';

@NgModule({
  imports: [SharedModule, ExploreContainerComponentModule, Tab1PageRoutingModule],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
