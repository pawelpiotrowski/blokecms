import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavigationModule } from '../navigation/navigation.module';
import { NavigationsComponent } from '../navigations/navigations.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationsComponent,
    data: { title: 'Navigations' },
    children: [
      {
        path: 'new',
        component: NavigationComponent,
        data: {
          title: 'Create Navigation',
        },
      },
      {
        path: ':id',
        component: NavigationComponent,
        data: {
          title: 'View Navigation',
        },
      },
      {
        path: ':id/edit',
        component: NavigationComponent,
        data: {
          title: 'Edit Navigation',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NavigationModule],
  exports: [RouterModule],
})
export class NavigationsRoutingModule {}
