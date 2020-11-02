import { NgModule } from '@angular/core';
import { PositionPage } from '@app/modules/position/position.page';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';
import { SharedModule } from '@shared/shared.module';

import { PositionPageRoutingModule } from '@app/modules/position/position-routing.module';

@NgModule({
  imports: [SharedModule, ExploreContainerComponentModule, PositionPageRoutingModule],
  declarations: [PositionPage],
})
export class PositionPageModule {}
