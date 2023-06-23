import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import {
  DeleteUserGQL,
  DeleteUserResponse,
  GetUserGQL,
  GetUserResponse,
  User,
} from 'shared-lib';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-child.component';
import { UserModel } from './user.model';

@Component({
  selector: 'admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends PageWithChildDrawerChildComponent<
  GetUserResponse,
  DeleteUserResponse
> {
  userData!: User;
  username!: string;

  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
    getUser: GetUserGQL,
    deleteUser: DeleteUserGQL,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = getUser;
    this.dataModel = { user: new UserModel() };
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.dataDeleteSource = deleteUser;
    this.entityLabel = 'User';
  }

  private dataSourceUpdateHandler(data: GetUserResponse) {
    this.userData = data.user;
    this.username = this.userData.username;
  }
}
