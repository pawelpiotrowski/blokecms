import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { ArticleModule } from '../article/article.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PageComponent],
  exports: [PageComponent],
  imports: [CommonModule, ArticleModule, RouterModule],
})
export class PageModule {}
