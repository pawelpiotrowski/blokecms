import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { UserModule } from '../user/user.module';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: {
      title: 'Users',
    },
    children: [
      {
        path: 'new',
        component: UserComponent,
        data: {
          title: 'Create User',
        },
      },
      {
        path: ':id',
        component: UserComponent,
        data: {
          title: 'View User',
        },
      },
      {
        path: ':id/edit',
        component: UserComponent,
        data: {
          title: 'Edit User',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), UserModule],
  // exporting here so its available in UsersModule
  exports: [RouterModule],
})
export class UsersRoutingModule {}
