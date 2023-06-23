import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StyleComponent } from '../style/style.component';
import { StyleModule } from '../style/style.module';
import { StylesComponent } from './styles.component';

const routes: Routes = [
  {
    path: '',
    component: StylesComponent,
    data: { title: 'Styles' },
    children: [
      {
        path: 'new',
        component: StyleComponent,
        data: {
          title: 'Create Style',
        },
      },
      {
        path: ':id',
        component: StyleComponent,
        data: {
          title: 'View Style',
        },
      },
      {
        path: ':id/edit',
        component: StyleComponent,
        data: {
          title: 'Edit Style',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), StyleModule],
  exports: [RouterModule],
})
export class StylesRoutingModule {}
