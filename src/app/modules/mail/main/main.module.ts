import { NgModule } from '@angular/core';
import { MailPage } from './main';
import { SharedModule } from '@shared/shared.module';
import { MailRoutingModule } from '../mail-routing.module';
// import { ComponentsModule } from '@app/modules/contact/component/components.module';


@NgModule({
  imports: [
    SharedModule,
    // ComponentsModule,
    MailRoutingModule
  ],
  declarations: [
    MailPage
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [

  ],
})
export class MailPageModule {
  constructor(
  ) {

  }
}
