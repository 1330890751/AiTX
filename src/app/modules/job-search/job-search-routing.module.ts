import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSearchPage } from '@app/modules/job-search/main/main';

/**
 * 加班模块路由
 */

const routes: Routes = [
  { path: '', component: JobSearchPage },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobSearchRoutingModule {}
