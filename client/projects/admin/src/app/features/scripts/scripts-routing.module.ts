import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScriptComponent } from '../script/script.component';
import { ScriptModule } from '../script/script.module';
import { ScriptsComponent } from './scripts.component';

const routes: Routes = [
  {
    path: '',
    component: ScriptsComponent,
    data: { title: 'Scripts' },
    children: [
      {
        path: 'new',
        component: ScriptComponent,
        data: {
          title: 'Create Script',
        },
      },
      {
        path: ':id',
        component: ScriptComponent,
        data: {
          title: 'View Script',
        },
      },
      {
        path: ':id/edit',
        component: ScriptComponent,
        data: {
          title: 'Edit Script',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ScriptModule],
  exports: [RouterModule],
})
export class ScriptsRoutingModule {}
