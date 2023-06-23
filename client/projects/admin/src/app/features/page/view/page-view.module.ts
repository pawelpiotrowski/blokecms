import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageViewComponent } from './page-view.component';
import { MatCardModule } from '@angular/material/card';
import { ArticleViewModule } from '../../article/view/article-view.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [PageViewComponent],
  exports: [PageViewComponent],
  imports: [CommonModule, MatCardModule, MatDividerModule, ArticleViewModule],
})
export class PageViewModule {}
