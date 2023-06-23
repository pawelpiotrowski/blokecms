import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngneat/effects-ng';
import { adminAuthRedirectUnauthenticated } from './auth/admin-auth.actions';
import { AdminAuthRepository } from './auth/admin-auth.repository';
import { LoginFormComponent } from './features/login/form/login-form.component';

@Component({
  selector: 'admin-app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'admin';

  constructor(
    private actions: Actions,
    private dialog: MatDialog,
    private authRepo: AdminAuthRepository,
  ) {}

  ngOnInit(): void {
    this.authRepo.expired$.subscribe((isExpired) => {
      if (isExpired) {
        this.openLoginDialog();
      }
    });
    this.authRepo.logout$.subscribe((isLogout) => {
      if (isLogout) {
        // TODO clearing apollo cache
        // this.apollo.client.clearStore();
        this.actions.dispatch(adminAuthRedirectUnauthenticated());
      }
    });
  }

  private openLoginDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '40vw',
      disableClose: true,
      // add route change listener
      // and close login popup if its open
      // if route is login
      closeOnNavigation: false,
      panelClass: 'app-login-prompt',
      backdropClass: 'app-login-backdrop',
    });
  }
}
