import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeComponent } from '../code/code.component';
import { CodeModule } from '../code/code.module';
import { CodesComponent } from './codes.component';

const routes: Routes = [
  {
    path: '',
    component: CodesComponent,
    data: { title: 'Code Blocks' },
    children: [
      {
        path: 'new',
        component: CodeComponent,
        data: {
          title: 'Create Code Block',
        },
      },
      {
        path: ':id',
        component: CodeComponent,
        data: {
          title: 'View Code Block',
        },
      },
      {
        path: ':id/edit',
        component: CodeComponent,
        data: {
          title: 'Edit Code Block',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CodeModule],
  exports: [RouterModule],
})
export class CodesRoutingModule {}
