import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  DeleteStyleGQL,
  DeleteStyleResponse,
  GetStyleGQL,
  GetStyleResponse,
  Style,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { StyleModel } from './style.model';

@Component({
  selector: 'admin-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss'],
})
export class StyleComponent extends PageWithChildDrawerChildComponent<
  GetStyleResponse,
  DeleteStyleResponse
> {
  styleData!: Style;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getStyle: GetStyleGQL,
    deleteStyle: DeleteStyleGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getStyle;
    this.dataModel = { style: new StyleModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteStyle;
    this.entityLabel = 'Style';
  }

  private dataSourceUpdateHandler(data: GetStyleResponse) {
    this.styleData = data.style;
  }
}
