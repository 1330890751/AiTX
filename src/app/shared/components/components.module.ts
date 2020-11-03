import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DemoComponent } from '@shared/components/demo/demo.component';
import { VxPageStateComponent } from '@shared/components/vx-pagestate/vx-pagestate';
import { VxNoDataComponent } from '@shared/components/vx-nodata/vx-nodata';
import { CityPickerComponent } from '@shared/components/city-picker/city-picker';
const components = [
  DemoComponent,
  VxPageStateComponent,
  VxNoDataComponent,
  CityPickerComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  exports: [...components],
})
export class ComponentsModule {}
