import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeUploadPage } from '@app/modules/resume-upload/main/main';

/**
 * 加班模块路由
 */

const routes: Routes = [
  { path: '', component: ResumeUploadPage },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumeUploadRoutingModule {}
