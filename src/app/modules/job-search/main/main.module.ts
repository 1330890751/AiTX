import { NgModule } from '@angular/core';
import { JobSearchPage } from './main';
import { SharedModule } from '@shared/shared.module';
import { JobSearchRoutingModule } from '../job-search-routing.module';
import { ComponentsModule } from '../component/components.module';
@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    JobSearchRoutingModule
  ],
  declarations: [
    JobSearchPage
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [

  ],
})
export class JobSearchPageModule {
  constructor(
  ) {

  }
}
