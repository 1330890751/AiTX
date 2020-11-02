import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from 'src/app/modules/tabs/tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'position',
        loadChildren: () => import('src/app/modules/position/position.module').then(m => m.PositionPageModule)
      },
      {
        path: 'me',
        loadChildren: () => import('src/app/modules/me/me.module').then(m => m.MePageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('src/app/modules/tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/position',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/position',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
