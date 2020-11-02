import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@shared/components/components.module';
import { HighlightDirective } from '@shared/directive/highlight-directive';
import { MomentPipe } from '@shared/pipes/moment.pipe';

const pipes = [MomentPipe];
const modules = [IonicModule, CommonModule, FormsModule, TranslateModule, ComponentsModule];
const components = [HighlightDirective];

@NgModule({
  declarations: [...pipes, ...components],
  imports: [CommonModule],
  exports: [...pipes, ...modules, ...components],
})
export class SharedModule {}
