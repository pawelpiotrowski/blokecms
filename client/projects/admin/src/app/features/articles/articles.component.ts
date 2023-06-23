import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllArticlesResponse,
  Article,
  DeleteArticleGQL,
  GetArticlesGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent extends PageWithChildDrawerComponent<AllArticlesResponse> {
  data!: Article[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    articles: GetArticlesGQL,
    deleteArticle: DeleteArticleGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = articles;
    this.dataSourceDeleteItem = deleteArticle;
    this.entityLabel = 'Article';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/articles', (event as Article)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/articles', (event as Article)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as Article)._id);
  }

  private dataSourceUpdateHandler(data: AllArticlesResponse) {
    this.data = data.articles;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'title',
        header: 'Title',
        cell: (text) => `${(text as Article).title}`,
      },
    ];
  }
}
