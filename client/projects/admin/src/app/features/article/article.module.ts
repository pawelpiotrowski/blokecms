import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { ArticleComponent } from './article.component';
import { ArticleViewModule } from './view/article-view.module';
import { ArticleFormModule } from './form/article-form.module';

@NgModule({
  declarations: [ArticleComponent],
  exports: [ArticleComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    ArticleViewModule,
    ArticleFormModule,
  ],
})
export class ArticleModule {}
