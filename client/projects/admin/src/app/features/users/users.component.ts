import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  GetUsersGQL,
  AllUsersResponse,
  DeleteUserGQL,
  User,
  LoggerService,
} from 'shared-lib';
import { AdminAuthUserResolved } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { PageContentListRow } from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { PageWithChildDrawerComponent } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer.component';
import { PageContentListColumn } from '../../layout/page-content-list-layout/page-content-list-layout.interface';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends PageWithChildDrawerComponent<AllUsersResponse> {
  data!: User[];
  columns!: PageContentListColumn[];
  // to filter out current user from the list
  private currentUserId!: string;

  constructor(
    router: Router,
    actions: Actions,
    logger: LoggerService,
    users: GetUsersGQL,
    deleteUser: DeleteUserGQL,
    private authRepo: AdminAuthRepository,
  ) {
    super(router, actions, logger);
    this.dataSource = users;
    this.dataSourceDeleteItem = deleteUser;
    this.entityLabel = 'User';
    this.dataSourceUpdateFunction = this.dataSourceUpdateHandler;
    this.setColumns();
    // to set currentUserId
    this.setAuthUserSubscription();
  }

  async editActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/users', (event as User)._id, 'edit']);
  }

  async viewActionEventHandler(event: PageContentListRow) {
    await this.redirect(['/users', (event as User)._id]);
  }

  deleteActionEventHandler(event: PageContentListRow) {
    this.deleteDataItem((event as User)._id);
  }

  private setColumns() {
    this.columns = [
      {
        columnDef: 'username',
        header: 'User',
        cell: (user) => `${(user as User).username}`,
      },
      {
        columnDef: 'isAdmin',
        header: 'Admin',
        cell: (user) => `${(user as User).isAdmin ? 'Yes' : 'No'}`,
      },
      {
        columnDef: 'createdAt',
        header: 'Created',
        cell: (user) => (user as User).createdAt as string,
        type: 'date',
      },
    ];
  }

  private dataSourceUpdateHandler(data: AllUsersResponse) {
    this.data = data.users.filter((user) => user._id !== this.currentUserId);
  }

  private setAuthUserSubscription() {
    this.authRepo.user$
      .pipe(
        filter((user) => user != null),
        map((user) => user as AdminAuthUserResolved),
      )
      .subscribe(({ _id }) => {
        this.currentUserId = _id;
      });
  }
}
