import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions } from '@ngneat/effects-ng';
import { finalize, Subscription, take } from 'rxjs';
import { AuthService } from 'shared-lib';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
} from '../../app.actions';
import { adminAuthLogout } from '../../auth/admin-auth.actions';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';

@Component({
  selector: 'admin-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  userName!: string;
  userResolved = false;
  accountPasswordForm!: FormGroup;
  pwdInputsHide = true;
  submitting = false;
  private authRepoSubscription!: Subscription;

  constructor(
    private authRepo: AdminAuthRepository,
    private auth: AuthService,
    private actions: Actions,
  ) {
    this.setUser(null);
  }

  ngOnInit() {
    this.authRepoSubscription = this.authRepo.user$.subscribe(
      this.setUser.bind(this),
    );
  }

  ngOnDestroy() {
    this.authRepoSubscription.unsubscribe();
  }

  togglePwdInputsHide() {
    this.pwdInputsHide = !this.pwdInputsHide;
  }

  submit() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.auth
      .changePassword(this.accountPasswordForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.submitting = false;
        }),
      )
      .subscribe({
        next: this.submitSuccessHandler.bind(this),
        error: this.submitErrorHandler.bind(this),
      });
  }

  get canSubmit() {
    return (
      this.accountPasswordFormCtrl['current'].value.length > 0 &&
      this.accountPasswordFormCtrl['new'].value.length > 0 &&
      this.accountPasswordFormCtrl['new'].value ===
        this.accountPasswordFormCtrl['confirm'].value
    );
  }

  get accountPasswordFormCtrl() {
    return this.accountPasswordForm.controls;
  }

  private submitSuccessHandler() {
    this.actions.dispatch(
      appDisplaySuccessMessage({ message: 'Password changed, please log in' }),
    );
    this.actions.dispatch(adminAuthLogout());
  }

  private submitErrorHandler() {
    this.actions.dispatch(
      appDisplayErrorMessage({
        message: 'There was an error please try again',
      }),
    );
    this.accountPasswordForm.reset();
  }

  private setUser(user: AdminAuthUser) {
    if (user == null) {
      this.userName = '';
      return;
    }
    this.userResolved = true;
    this.userName = user.username;
    this.setAccountPasswordForm();
  }

  private setAccountPasswordForm() {
    this.accountPasswordForm = new FormGroup({
      current: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      new: new FormControl('', [Validators.required, Validators.minLength(1)]),
      confirm: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }
}
