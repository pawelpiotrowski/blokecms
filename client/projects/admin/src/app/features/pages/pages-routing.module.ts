import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponent } from '../page/page.component';
import { PageModule } from '../page/page.module';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    data: { title: 'Pages' },
    children: [
      {
        path: 'new',
        component: PageComponent,
        data: {
          title: 'Create Page',
        },
      },
      {
        path: ':id',
        component: PageComponent,
        data: {
          title: 'View Page',
        },
      },
      {
        path: ':id/edit',
        component: PageComponent,
        data: {
          title: 'Edit Page',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), PageModule],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
