import { NgModule } from '@angular/core';
import { InforMationPage } from './main';
import { SharedModule } from '@shared/shared.module';
import { InforMationRoutingModule } from '../information-routing.module';
// import { ComponentsModule } from '@app/modules/contact/component/components.module';


@NgModule({
  imports: [
    SharedModule,
    // ComponentsModule,
    InforMationRoutingModule
  ],
  declarations: [
    InforMationPage
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [

  ],
})
export class InforMationPageModule {
  constructor(
  ) {

  }
}
