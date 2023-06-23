import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllBlocksTextResponse,
  BlockText,
  DeleteBlockTextGQL,
  GetBlocksTextGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss'],
})
export class BlocksComponent extends PageWithChildDrawerComponent<AllBlocksTextResponse> {
  data!: BlockText[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    texts: GetBlocksTextGQL,
    deleteText: DeleteBlockTextGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = texts;
    this.dataSourceDeleteItem = deleteText;
    this.entityLabel = 'Block';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/blocks', (event as BlockText)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/blocks', (event as BlockText)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as BlockText)._id);
  }

  private dataSourceUpdateHandler(data: AllBlocksTextResponse) {
    this.data = data.blocksText;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (text) => `${(text as BlockText).name}`,
      },
    ];
  }
}
