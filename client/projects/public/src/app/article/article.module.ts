import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { BlockModule } from '../block/block.module';

@NgModule({
  declarations: [ArticleComponent],
  exports: [ArticleComponent],
  imports: [CommonModule, BlockModule],
})
export class ArticleModule {}
