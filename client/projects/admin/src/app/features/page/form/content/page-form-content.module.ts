import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFormContentComponent } from './page-form-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ArticleViewModule } from '../../../article/view/article-view.module';

@NgModule({
  declarations: [PageFormContentComponent],
  exports: [PageFormContentComponent],
  imports: [
    CommonModule,
    ArticleViewModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
  ],
})
export class PageFormContentModule {}
