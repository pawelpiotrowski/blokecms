import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllNavigationsResponse,
  Navigation,
  DeleteNavigationGQL,
  GetNavigationsGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-navigations',
  templateUrl: './navigations.component.html',
  styleUrls: ['./navigations.component.scss'],
})
export class NavigationsComponent extends PageWithChildDrawerComponent<AllNavigationsResponse> {
  data!: Navigation[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    navigations: GetNavigationsGQL,
    deleteNavigation: DeleteNavigationGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = navigations;
    this.dataSourceDeleteItem = deleteNavigation;
    this.entityLabel = 'Navigation';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect([
      '/settings/navigations',
      (event as Navigation)._id,
      'edit',
    ]);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/settings/navigations', (event as Navigation)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as Navigation)._id);
  }

  private dataSourceUpdateHandler(data: AllNavigationsResponse) {
    this.data = data.navigations;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (nav) => `${(nav as Navigation).name}`,
      },
    ];
  }
}
