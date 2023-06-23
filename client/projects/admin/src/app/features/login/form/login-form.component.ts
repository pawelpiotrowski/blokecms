import { Component, OnInit, Optional } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngneat/effects-ng';
import { delay, of, take } from 'rxjs';
import { AuthService, LoggerService } from 'shared-lib';
import { appDisplayErrorMessage } from '../../../app.actions';
import { adminAuthRedirectAuthenticated } from '../../../auth/admin-auth.actions';

@Component({
  selector: 'admin-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  pwdInputHide = true;
  loginProcessing = false;
  hasError = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private logger: LoggerService,
    private auth: AuthService,
    private actions: Actions,
    @Optional() public dialogRef: MatDialogRef<LoginFormComponent>,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.canSubmit || this.loginProcessing) {
      return;
    }
    this.pwdInputHide = true;
    this.loginProcessing = true;
    this.auth
      .logIn(this.loginForm.value)
      .pipe(take(1))
      .subscribe({
        next: this.loginHandler.bind(this),
        error: this.loginErrorHandler.bind(this),
      });
  }

  togglePwdInputHide(): void {
    this.pwdInputHide = !this.pwdInputHide;
  }

  get canSubmit(): boolean {
    return (
      (this.loginForm &&
        this.loginForm.status &&
        this.loginForm.status === 'VALID') ||
      false
    );
  }

  // convenience getter for easy access to form fields
  get formCtrl(): {
    [key: string]: AbstractControl;
  } {
    return this.loginForm.controls;
  }

  private loginHandler(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    this.actions.dispatch(adminAuthRedirectAuthenticated());
  }

  private loginErrorHandler(err: any): void {
    // TODO distinguish between 401 and in ex 500 to shake and reset only on 401
    this.logger.error('Error on user login', LoginFormComponent.name, err);
    this.loginProcessing = false;
    this.shakePanelOnError();
  }

  private shakePanelOnError() {
    this.hasError = true;
    of(true)
      .pipe(delay(400))
      .subscribe(this.removeErrorResetFormAndDisplayToast.bind(this));
  }

  private removeErrorResetFormAndDisplayToast() {
    this.hasError = false;
    this.loginForm.reset();
    this.actions.dispatch(
      appDisplayErrorMessage({
        message: 'Please check your credentials and try again',
      }),
    );
  }
}
