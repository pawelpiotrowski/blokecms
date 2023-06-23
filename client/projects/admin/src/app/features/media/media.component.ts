import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  BlockMedia,
  DeleteBlockMediaGQL,
  DeleteBlockResponse,
  GetBlockMediaGQL,
  GetBlockMediaResponse,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { BlockMediaModel } from './media.model';

@Component({
  selector: 'admin-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent extends PageWithChildDrawerChildComponent<
  GetBlockMediaResponse,
  DeleteBlockResponse
> {
  blockMediaData!: BlockMedia;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getBlockMedia: GetBlockMediaGQL,
    deleteBlockMedia: DeleteBlockMediaGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getBlockMedia;
    this.dataModel = { blockMedia: new BlockMediaModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteBlockMedia;
    this.entityLabel = 'Multimedia';
  }

  private dataSourceUpdateHandler(data: GetBlockMediaResponse) {
    this.blockMediaData = data.blockMedia;
  }
}
