import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomePageModule } from './home-page/home-page.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { NotFoundPageModule } from './not-found-page/not-found-page.module';
import { PageResolver } from './page/page.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotFoundPageComponent,
      },
      {
        path: '',
        component: HomePageComponent,
        resolve: {
          page: PageResolver,
        },
      },
      {
        path: '**',
        loadChildren: () =>
          import('./features/dynamic-page/dynamic-page.module').then(
            (m) => m.DynamicPageModule,
          ),
        resolve: {
          page: PageResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
    NotFoundPageModule,
    HomePageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
