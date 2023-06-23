import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleViewComponent } from './article-view.component';
import { MatCardModule } from '@angular/material/card';
import { ArticleContentModule } from '../content/article-content.module';

@NgModule({
  declarations: [ArticleViewComponent],
  exports: [ArticleViewComponent],
  imports: [CommonModule, MatCardModule, ArticleContentModule],
})
export class ArticleViewModule {}
