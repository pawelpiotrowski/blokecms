import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType } from '@ngneat/effects';
import { switchMap, tap } from 'rxjs';
import { AuthService } from 'shared-lib';
import {
  adminAuthLogout,
  adminAuthRedirectAuthenticated,
  adminAuthRedirectUnauthenticated,
} from './admin-auth.actions';
import { AdminAuthRepository } from './admin-auth.repository';

@Injectable({ providedIn: 'root' })
export class AdminAuthEffects {
  constructor(
    private router: Router,
    private auth: AuthService,
    private authRepo: AdminAuthRepository,
  ) {}

  logout$ = createEffect((actions) =>
    actions.pipe(
      ofType(adminAuthLogout),
      switchMap(() => this.auth.logOut()),
      tap(() => this.authRepo.updateLogout(true)),
    ),
  );

  redirectAuthenticated$ = createEffect((actions) =>
    actions.pipe(
      ofType(adminAuthRedirectAuthenticated),
      switchMap(() => this.router.navigate(['/dashboard'])),
    ),
  );

  redirectUnauthenticated$ = createEffect((actions) =>
    actions.pipe(
      ofType(adminAuthRedirectUnauthenticated),
      switchMap(() => this.router.navigate(['/login'])),
    ),
  );
}
