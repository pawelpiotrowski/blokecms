import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleFormContentComponent } from './article-form-content.component';
import { ArticleContentModule } from '../../content/article-content.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ArticleFormContentNameComponent } from './article-form-content-name.component';

@NgModule({
  declarations: [ArticleFormContentComponent, ArticleFormContentNameComponent],
  exports: [ArticleFormContentComponent],
  imports: [
    CommonModule,
    ArticleContentModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
  ],
})
export class ArticleFormContentModule {}
