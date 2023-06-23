import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { delay, filter, Subscription, take, tap } from 'rxjs';
import { adminAuthRedirectAuthenticated } from '../../auth/admin-auth.actions';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isUserResolved = false;
  resolvingUserMessage!: string;
  resolvingUserWebDing!: string;
  private authErrorSubscription!: Subscription;
  private readonly resolvingUserErrMessageDelay = 3000;

  constructor(private actions: Actions, private authRepo: AdminAuthRepository) {
    this.setResolvingUserMessage();
  }

  ngOnInit(): void {
    this.authRepo.user$
      .pipe(
        filter((user) => user !== undefined),
        take(1),
      )
      .subscribe(this.authRepoUserHandler.bind(this));
    this.authErrorSubscription = this.authRepo.error$
      .pipe(
        tap(() => {
          this.setResolvingUserErrorMessage();
        }),
        filter((err) => err != null),
        delay(this.resolvingUserErrMessageDelay),
      )
      .subscribe(() => {
        this.isUserResolved = true;
        this.setResolvingUserMessage();
      });
  }

  ngOnDestroy(): void {
    this.authErrorSubscription.unsubscribe();
  }

  private setResolvingUserMessage() {
    this.resolvingUserMessage = 'Logging in, just a sec...';
    this.resolvingUserWebDing = 'H';
  }

  private setResolvingUserErrorMessage() {
    this.resolvingUserMessage = 'Oops there was an error, please try to log in';
    this.resolvingUserWebDing = 'B';
  }

  private authRepoUserHandler(user: AdminAuthUser) {
    if (user !== null) {
      this.actions.dispatch(adminAuthRedirectAuthenticated());
      return;
    }
    this.isUserResolved = true;
  }
}
