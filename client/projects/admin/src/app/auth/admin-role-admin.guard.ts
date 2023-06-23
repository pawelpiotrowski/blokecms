import { Injectable } from '@angular/core';

import { Actions } from '@ngneat/effects-ng';
import { map, tap, zip } from 'rxjs';
import { AuthService, LoggerService } from 'shared-lib';
import { adminAuthRedirectAuthenticated } from './admin-auth.actions';
import { AdminAuthGuard } from './admin-auth.guard';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleAdminGuard  {
  constructor(
    private authGuard: AdminAuthGuard,
    private auth: AuthService,
    private logger: LoggerService,
    private actions: Actions,
  ) {}

  canLoad() {
    return zip(this.authGuard.canLoad(), this.auth.role()).pipe(
      map(([canLoad, role]) => canLoad && role.isAdmin),
      // catchError((err) => of(false)),
      tap((isAdmin) => {
        this.logger.log(
          `AUTH ROLE ADMIN Guard user can${isAdmin ? '' : ' NOT'} load`,
          AdminRoleAdminGuard.name,
        );
        if (!isAdmin) {
          this.actions.dispatch(adminAuthRedirectAuthenticated());
        }
      }),
    );
  }

  canActivate() {
    return this.canLoad();
  }
}
