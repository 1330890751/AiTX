import { NgModule } from '@angular/core';
import { JobSearchPage } from './main';
import { SharedModule } from '@shared/shared.module';
import { JobSearchRoutingModule } from '../job-search-routing.module';
@NgModule({
  imports: [
    SharedModule,
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
