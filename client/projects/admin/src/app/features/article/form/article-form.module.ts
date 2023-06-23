import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ArticleFormComponent } from './article-form.component';
import { ArticleFormContentModule } from './content/article-form-content.module';
import { ArticleFormToolbarModule } from './toolbar/article-form-toolbar.module';

@NgModule({
  declarations: [ArticleFormComponent],
  exports: [ArticleFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    ArticleFormContentModule,
    ArticleFormToolbarModule,
  ],
})
export class ArticleFormModule {}
