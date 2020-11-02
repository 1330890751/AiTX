import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ContactIndexedComponent } from './contact-indexed';
@NgModule({
  declarations: [ContactIndexedComponent],
  imports: [SharedModule],
  exports: [ContactIndexedComponent],
})
export class ComponentsModule {}
