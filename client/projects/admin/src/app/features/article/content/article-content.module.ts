import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleContentComponent } from './article-content.component';
import { BlockViewModule } from '../../block/view/block-view.module';
import { MediaViewModule } from '../../media/view/media-view.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodeViewModule } from '../../code/view/code-view.module';

@NgModule({
  declarations: [ArticleContentComponent],
  exports: [ArticleContentComponent],
  imports: [
    CommonModule,
    BlockViewModule,
    MediaViewModule,
    CodeViewModule,
    MatProgressSpinnerModule,
  ],
})
export class ArticleContentModule {}
