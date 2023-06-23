import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchModule } from '../../../search/search.module';
import { ArticleFormToolbarComponent } from './article-form-toolbar.component';

@NgModule({
  declarations: [ArticleFormToolbarComponent],
  exports: [ArticleFormToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    SearchModule,
  ],
})
export class ArticleFormToolbarModule {}
