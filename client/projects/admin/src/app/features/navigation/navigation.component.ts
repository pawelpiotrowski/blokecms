import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  Navigation,
  DeleteNavigationGQL,
  DeleteNavigationResponse,
  GetNavigationGQL,
  GetNavigationResponse,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { NavigationModel } from './navigation.model';

@Component({
  selector: 'admin-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent extends PageWithChildDrawerChildComponent<
  GetNavigationResponse,
  DeleteNavigationResponse
> {
  navigationData!: Navigation;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getNavigation: GetNavigationGQL,
    deleteNavigation: DeleteNavigationGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getNavigation;
    this.dataModel = { navigation: new NavigationModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteNavigation;
    this.entityLabel = 'Navigation';
  }

  private dataSourceUpdateHandler(data: GetNavigationResponse) {
    this.navigationData = data.navigation;
  }
}
