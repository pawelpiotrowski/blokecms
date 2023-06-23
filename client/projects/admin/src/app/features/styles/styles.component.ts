import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllStylesResponse,
  DeleteStyleGQL,
  GetStylesGQL,
  LoggerService,
  Style,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss'],
})
export class StylesComponent extends PageWithChildDrawerComponent<AllStylesResponse> {
  data!: Style[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    styles: GetStylesGQL,
    deleteStyle: DeleteStyleGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = styles;
    this.dataSourceDeleteItem = deleteStyle;
    this.entityLabel = 'Style';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/settings/styles', (event as Style)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/settings/styles', (event as Style)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as Style)._id);
  }

  private dataSourceUpdateHandler(data: AllStylesResponse) {
    this.data = data.styles;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (style) => `${(style as Style).name}`,
      },
    ];
  }
}
