import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  Article,
  DeleteArticleGQL,
  DeleteArticleResponse,
  GetArticleGQL,
  GetArticleResponse,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { ArticleModel } from './article.model';

@Component({
  selector: 'admin-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent extends PageWithChildDrawerChildComponent<
  GetArticleResponse,
  DeleteArticleResponse
> {
  articleData!: Article;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getArticle: GetArticleGQL,
    deleteArticle: DeleteArticleGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getArticle;
    this.dataModel = { article: new ArticleModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteArticle;
    this.entityLabel = 'Article';
  }

  private dataSourceUpdateHandler(data: GetArticleResponse) {
    this.articleData = data.article;
  }
}
