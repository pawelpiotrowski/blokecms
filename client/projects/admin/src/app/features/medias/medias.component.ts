import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  AllBlocksMediaResponse,
  BlockMedia,
  DeleteBlockMediaGQL,
  GetBlocksMediaGQL,
  LoggerService,
} from 'shared-lib';
import {
  PageContentListColumn,
  PageContentListRow,
} from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';

@Component({
  selector: 'admin-medias',
  templateUrl: './medias.component.html',
  styleUrls: ['./medias.component.scss'],
})
export class MediasComponent extends PageWithChildDrawerComponent<AllBlocksMediaResponse> {
  data!: BlockMedia[];
  columns!: PageContentListColumn[];

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    medias: GetBlocksMediaGQL,
    deleteMedia: DeleteBlockMediaGQL,
  ) {
    super(router, actions, logger);
    this.dataSource = medias;
    this.dataSourceDeleteItem = deleteMedia;
    this.entityLabel = 'Multimedia';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/multimedia', (event as BlockMedia)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/multimedia', (event as BlockMedia)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as BlockMedia)._id);
  }

  private dataSourceUpdateHandler(data: AllBlocksMediaResponse) {
    this.data = data.blocksMedia;
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'name',
        header: 'Name',
        cell: (media) => `${(media as BlockMedia).name}`,
      },
    ];
  }
}
