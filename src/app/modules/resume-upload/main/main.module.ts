import { NgModule } from '@angular/core';
import { ResumeUploadPage } from './main';
import { SharedModule } from '@shared/shared.module';
import { ResumeUploadRoutingModule } from '../resume-upload-routing.module';
// import { ComponentsModule } from '@app/modules/contact/component/components.module';


@NgModule({
  imports: [
    SharedModule,
    // ComponentsModule,
    ResumeUploadRoutingModule
  ],
  declarations: [
    ResumeUploadPage
  ],
  entryComponents: [

  ],
  providers: [
  ],
  exports: [

  ],
})
export class ResumeUploadPageModule {
  constructor(
  ) {

  }
}
