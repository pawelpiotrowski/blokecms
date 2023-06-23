import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllPagesResponse,
  Page,
  DeletePageGQL,
  GetPagesGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent extends PageWithChildDrawerComponent<AllPagesResponse> {
  data!: Page[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    pages: GetPagesGQL,
    deletePage: DeletePageGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = pages;
    this.dataSourceDeleteItem = deletePage;
    this.entityLabel = 'Page';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/pages', (event as Page)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/pages', (event as Page)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as Page)._id);
  }

  private dataSourceUpdateHandler(data: AllPagesResponse) {
    this.data = data.pages;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'title',
        header: 'Title',
        cell: (page) => `${(page as Page).title}`,
      },
      {
        columnDef: 'slug',
        header: 'Slug',
        cell: (page) => `/${(page as Page).slug}`,
      },
    ];
  }
}
