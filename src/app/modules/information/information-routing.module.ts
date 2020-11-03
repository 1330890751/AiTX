import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InforMationPage } from '@app/modules/information/main/main';

/**
 * 加班模块路由
 */

const routes: Routes = [
  { path: '', component: InforMationPage },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InforMationRoutingModule {}
