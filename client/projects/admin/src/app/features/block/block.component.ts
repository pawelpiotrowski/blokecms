import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  BlockText,
  DeleteBlockResponse,
  DeleteBlockTextGQL,
  GetBlockTextGQL,
  GetBlockTextResponse,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { BlockTextModel } from './block.model';

@Component({
  selector: 'admin-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent extends PageWithChildDrawerChildComponent<
  GetBlockTextResponse,
  DeleteBlockResponse
> {
  blockTextData!: BlockText;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getBlockText: GetBlockTextGQL,
    deleteBlockText: DeleteBlockTextGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getBlockText;
    this.dataModel = { blockText: new BlockTextModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteBlockText;
    this.entityLabel = 'Block';
  }

  private dataSourceUpdateHandler(data: GetBlockTextResponse) {
    this.blockTextData = data.blockText;
  }
}
