import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionPage } from '@app/modules/position/position.page';

const routes: Routes = [
  {
    path: '',
    component: PositionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionPageRoutingModule {}
