import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: { title: 'Settings' },
    children: [
      {
        path: '',
        redirectTo: 'navigations',
        pathMatch: 'full',
      },
      {
        path: 'styles',
        loadChildren: () =>
          import('../styles/styles.module').then((m) => m.StylesModule),
      },
      {
        path: 'navigations',
        loadChildren: () =>
          import('../navigations/navigations.module').then(
            (m) => m.NavigationsModule,
          ),
      },
      {
        path: 'scripts',
        loadChildren: () =>
          import('../scripts/scripts.module').then((m) => m.ScriptsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
