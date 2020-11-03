import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from 'src/app/modules/tab3/tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
  }, {// Job search
    path: 'JobSearchPage',
    loadChildren: () =>
      import('../job-search/main/main.module').then((m) => m.JobSearchPageModule),
  }, {// ResumeUploadPage
    path: 'ResumeUploadPage',
    loadChildren: () =>
      import('../resume-upload/main/main.module').then((m) => m.ResumeUploadPageModule),
  }, {// InfoMationPage
    path: 'InforMationPage',
    loadChildren: () =>
      import('../information/main/main.module').then((m) => m.InforMationPageModule),
  }, {// MailPage
    path: 'MailPage',
    loadChildren: () =>
      import('../mail/main/main.module').then((m) => m.MailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
