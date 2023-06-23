import { Injectable } from '@angular/core';

import { Actions } from '@ngneat/effects-ng';
import { filter, map, tap } from 'rxjs';
import { AuthService, LoggerService } from 'shared-lib';
import { adminAuthRedirectUnauthenticated } from './admin-auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard  {
  constructor(
    private actions: Actions,
    private auth: AuthService,
    private logger: LoggerService,
  ) {}

  canLoad() {
    return this.auth.isAuthenticated().pipe(
      filter((isAuthenticated) => typeof isAuthenticated === 'boolean'),
      map((isAuthenticated) => isAuthenticated as boolean),
      tap((isLegit) => {
        this.logger.log(
          `AUTH Guard user can${isLegit ? '' : ' NOT'} load`,
          AdminAuthGuard.name,
        );
        if (!isLegit) {
          this.actions.dispatch(adminAuthRedirectUnauthenticated());
        }
      }),
    );
  }

  canActivate() {
    return this.canLoad();
  }
}
