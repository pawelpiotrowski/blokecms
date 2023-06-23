import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './auth/admin-auth.guard';
import { AdminRoleAdminGuard } from './auth/admin-role-admin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.module').then((m) => m.UsersModule),
    canActivate: [AdminRoleAdminGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./features/account/account.module').then((m) => m.AccountModule),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'multimedia',
    loadChildren: () =>
      import('./features/medias/medias.module').then((m) => m.MediasModule),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'blocks',
    loadChildren: () =>
      import('./features/blocks/blocks.module').then((m) => m.BlocksModule),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('./features/articles/articles.module').then(
        (m) => m.ArticlesModule,
      ),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./features/pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.module').then(
        (m) => m.SettingsModule,
      ),
    canActivate: [AdminRoleAdminGuard],
  },
  {
    path: 'code-blocks',
    loadChildren: () =>
      import('./features/codes/codes.module').then((m) => m.CodesModule),
    canActivate: [AdminAuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
