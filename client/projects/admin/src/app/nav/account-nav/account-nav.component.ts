import { Component } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { adminAuthLogout } from '../../auth/admin-auth.actions';
import { NavComponent } from '../nav.component';

@Component({
  selector: 'admin-account-nav',
  templateUrl: './account-nav.component.html',
  styleUrls: ['./account-nav.component.scss'],
})
export class AccountNavComponent extends NavComponent {
  constructor(private actions: Actions) {
    super(...NavComponent.deps());
  }

  logOut() {
    this.actions.dispatch(adminAuthLogout());
  }
}
