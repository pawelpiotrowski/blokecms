import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllBlocksCodeResponse,
  BlockCode,
  DeleteBlockCodeGQL,
  GetBlocksCodeGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-codes',
  templateUrl: './codes.component.html',
  styleUrls: ['./codes.component.scss'],
})
export class CodesComponent extends PageWithChildDrawerComponent<AllBlocksCodeResponse> {
  data!: BlockCode[];
  columns!: PageContentListColumn[];
  entityRoute = '/code-blocks';

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    codes: GetBlocksCodeGQL,
    deleteCode: DeleteBlockCodeGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = codes;
    this.dataSourceDeleteItem = deleteCode;
    this.entityLabel = 'Code Block';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect([this.entityRoute, (event as BlockCode)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect([this.entityRoute, (event as BlockCode)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as BlockCode)._id);
  }

  private dataSourceUpdateHandler(data: AllBlocksCodeResponse) {
    this.data = data.blocksCode;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (code) => `${(code as BlockCode).name}`,
      },
    ];
  }
}
