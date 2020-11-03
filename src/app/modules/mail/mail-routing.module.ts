import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MailPage } from '@app/modules/mail/main/main';

/**
 * 加班模块路由
 */

const routes: Routes = [
  { path: '', component: MailPage },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailRoutingModule {}
