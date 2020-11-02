import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DemoComponent } from '@shared/components/demo/demo.component';
const components = [DemoComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  exports: [...components],
})
export class ComponentsModule {}
