import { Injectable } from '@angular/core';
import { createStore, withProps, select } from '@ngneat/elf';
import { filter, map, take, zip, Observable } from 'rxjs';
import { AuthService } from 'shared-lib';
import {
  AdminAuthError,
  AdminAuthExpired,
  AdminAuthLogout,
  AdminAuthProps,
  AdminAuthUser,
} from './admin-auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthRepository {
  user$: Observable<AdminAuthUser>;
  expired$: Observable<AdminAuthExpired>;
  logout$: Observable<AdminAuthLogout>;
  error$: Observable<AdminAuthError>;

  private readonly storeName = 'adminAuth';
  private store;

  constructor(private auth: AuthService) {
    this.store = this.createStore();
    this.user$ = this.store.pipe(select((state) => state.user));
    this.expired$ = this.store.pipe(select((state) => state.expired));
    this.logout$ = this.store.pipe(select((state) => state.logout));
    this.error$ = this.store.pipe(select((state) => state.error));
    this.setIsAuthenticatedSubscription();
    this.setAuthenticatedErrorSubscription();
  }

  updateLogout(logout: AdminAuthLogout) {
    this.store.update((state) => ({
      ...state,
      logout,
    }));
  }

  private updateError(error: AdminAuthError) {
    this.store.update((state) => ({
      ...state,
      error,
    }));
  }

  private updateUser(user: AdminAuthUser) {
    this.store.update((state) => ({
      ...state,
      user,
    }));
  }

  private updateExpired(expired: AdminAuthExpired) {
    this.store.update((state) => ({
      ...state,
      expired,
    }));
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: this.storeName },
      withProps<AdminAuthProps>({
        user: undefined,
        expired: undefined,
        logout: undefined,
        error: undefined,
      }),
    );

    return store;
  }

  private setIsAuthenticatedSubscription() {
    // login/logout
    this.auth
      .isAuthenticated()
      .pipe(
        filter((isAuthenticated) => typeof isAuthenticated === 'boolean'),
        map((isAuthenticated) => isAuthenticated as boolean),
      )
      .subscribe(this.isAuthenticatedHandler.bind(this));

    // refresh token expired
    this.auth.isExpired().subscribe((expired) => {
      this.updateExpired(expired);
    });
  }

  private isAuthenticatedHandler(isAuthenticated: boolean) {
    if (isAuthenticated === false) {
      this.updateUser(null);
      return;
    }
    zip(this.auth.whoAmI(), this.auth.role())
      .pipe(take(1))
      .subscribe(([{ _id, username }, { isAdmin }]) => {
        this.updateUser({ _id, username, isAdmin });
        this.updateExpired(false);
        this.updateLogout(false);
      });
  }

  private setAuthenticatedErrorSubscription() {
    this.auth.error.subscribe(this.updateError.bind(this));
  }
}
