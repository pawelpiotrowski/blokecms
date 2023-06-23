import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from '../article/article.component';
import { ArticleModule } from '../article/article.module';
import { ArticlesComponent } from './articles.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    data: { title: 'Articles' },
    children: [
      {
        path: 'new',
        component: ArticleComponent,
        data: {
          title: 'Create Article',
        },
      },
      {
        path: ':id',
        component: ArticleComponent,
        data: {
          title: 'View Article',
        },
      },
      {
        path: ':id/edit',
        component: ArticleComponent,
        data: {
          title: 'Edit Article',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ArticleModule],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
