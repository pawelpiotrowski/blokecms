import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  Page,
  DeletePageGQL,
  DeletePageResponse,
  GetPageGQL,
  GetPageResponse,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { PageModel } from './page.model';

@Component({
  selector: 'admin-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent extends PageWithChildDrawerChildComponent<
  GetPageResponse,
  DeletePageResponse
> {
  pageData!: Page;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getPage: GetPageGQL,
    deletePage: DeletePageGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getPage;
    this.dataModel = { page: new PageModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deletePage;
    this.entityLabel = 'Page';
  }

  private dataSourceUpdateHandler(data: GetPageResponse) {
    this.pageData = data.page;
  }
}
