import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  GetBlockCodeResponse,
  DeleteBlockResponse,
  BlockCode,
  GetBlockCodeGQL,
  DeleteBlockCodeGQL,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { BlockCodeModel } from './code.model';

@Component({
  selector: 'admin-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent extends PageWithChildDrawerChildComponent<
  GetBlockCodeResponse,
  DeleteBlockResponse
> {
  codeData!: BlockCode;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getBlockCode: GetBlockCodeGQL,
    deleteBlockCode: DeleteBlockCodeGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getBlockCode;
    this.dataModel = { blockCode: new BlockCodeModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteBlockCode;
    this.entityLabel = 'Code Block';
  }

  private dataSourceUpdateHandler(data: GetBlockCodeResponse) {
    this.codeData = data.blockCode;
  }
}
