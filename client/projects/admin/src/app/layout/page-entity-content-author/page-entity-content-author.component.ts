import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { filter, take, zip } from 'rxjs';
import { GetUserGQL, GetUserResponse } from 'shared-lib';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';

@Component({
  selector: 'admin-page-entity-content-author',
  templateUrl: './page-entity-content-author.component.html',
  styleUrls: ['./page-entity-content-author.component.scss'],
})
export class PageEntityContentAuthorComponent implements OnChanges {
  @Input() createdByUserId!: string;
  createdByUsername!: string;

  private readonly createdByUsernameError = 'Not found';
  private readonly createdByUsernameYou = 'You';

  constructor(
    private getUser: GetUserGQL,
    private authRepo: AdminAuthRepository,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['createdByUserId'] &&
      changes['createdByUserId'].currentValue != null
    ) {
      this.setCreatedBy();
    }
  }

  get canCreateCreatedByLink() {
    return (
      typeof this.createdByUsername === 'string' &&
      [this.createdByUsernameError, this.createdByUsernameYou].indexOf(
        this.createdByUsername,
      ) === -1
    );
  }

  private setCreatedBy() {
    this.createdByUserId = this.createdByUserId;
    const createdByUserSub = this.getUser
      .fetch(
        { input: { _id: this.createdByUserId } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      )
      .pipe(
        filter(({ loading }) => loading === false),
        take(1),
      );
    const currentUserSub = this.authRepo.user$.pipe(take(1));

    zip(createdByUserSub, currentUserSub).subscribe(
      this.setCreatedBySubsHandler.bind(this),
    );
  }

  private setCreatedBySubsHandler([createdByUser, currentUser]: [
    ApolloQueryResult<GetUserResponse>,
    AdminAuthUser,
  ]) {
    if (
      createdByUser.data == null ||
      createdByUser.errors ||
      currentUser == null
    ) {
      this.createdByUsername = this.createdByUsernameError;
      return;
    }
    if (createdByUser.data.user._id === currentUser._id) {
      this.createdByUsername = this.createdByUsernameYou;
      return;
    }
    this.createdByUsername = createdByUser.data.user.username;
  }
}
