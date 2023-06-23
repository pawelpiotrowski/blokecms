import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthLogoutResponse, AuthService } from 'shared-lib';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
} from '../../app.actions';
import { adminAuthLogout } from '../../auth/admin-auth.actions';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authRepo: AdminAuthRepository;
  let authService: AuthService;
  let actions: Actions;
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const changePassword$ = new Subject<AuthLogoutResponse>();
  const mockAdminAuthRepository = {
    user$,
  };
  const mockAuthService = {
    changePassword: jest.fn().mockReturnValue(changePassword$.asObservable()),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Actions, useValue: mockActions },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
      ],
    }).compileComponents();

    authRepo = TestBed.inject(AdminAuthRepository);
    authService = TestBed.inject(AuthService);
    actions = TestBed.inject(Actions);
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should subscribe to auth repo to get user name and set userResolved flag when finished', () => {
      expect(component.userResolved).toEqual(false);
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      jest.spyOn(authRepo.user$, 'subscribe');
      fixture.detectChanges();
      expect(authRepo.user$.subscribe).toHaveBeenCalled();
      expect(component.userResolved).toEqual(true);
      expect(component.userName).toEqual('test');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from auth repo', () => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      fixture.detectChanges();
      expect(component.userName).toEqual('test');
      component.ngOnDestroy();
      user$.next({ username: 'foo', _id: '2', isAdmin: true });
      expect(component.userName).not.toEqual('foo');
    });
  });

  describe('togglePwdInputsHide', () => {
    it('should toggle pwdInputsHide flag', () => {
      fixture.detectChanges();
      expect(component.pwdInputsHide).toEqual(true);
      component.togglePwdInputsHide();
      expect(component.pwdInputsHide).toEqual(false);
      component.togglePwdInputsHide();
      expect(component.pwdInputsHide).toEqual(true);
    });
  });

  describe('submit', () => {
    it('should return early if submitting flag is set to true', () => {
      component.submitting = true;
      fixture.detectChanges();

      component.submit();
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it('should set submitting flag to true and call change password', () => {
      const mockAccountPasswordFormValue = {
        current: 'foo',
        new: 'bar',
        confirm: 'bar',
      };

      fixture.detectChanges();
      expect(component.submitting).toEqual(false);
      component.accountPasswordForm.setValue(mockAccountPasswordFormValue);

      component.submit();
      expect(component.submitting).toEqual(true);
      expect(authService.changePassword).toHaveBeenLastCalledWith(
        mockAccountPasswordFormValue,
      );
      changePassword$.next({ ok: true });
      expect(component.submitting).toEqual(false);
      expect(actions.dispatch).toHaveBeenCalledTimes(2);
      expect(actions.dispatch).toHaveBeenNthCalledWith(
        1,
        appDisplaySuccessMessage({
          message: 'Password changed, please log in',
        }),
      );
      expect(actions.dispatch).toHaveBeenNthCalledWith(2, adminAuthLogout());
    });

    it('should set submitting flag to false and dispatch error message on error', () => {
      fixture.detectChanges();
      expect(component.submitting).toEqual(false);
      component.submit();
      expect(component.submitting).toEqual(true);
      changePassword$.error(new Error('error'));
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplayErrorMessage({
          message: 'There was an error please try again',
        }),
      );
      expect(component.submitting).toEqual(false);
    });
  });

  describe('canSubmit', () => {
    it('should return false when some of form values are not filled', () => {
      fixture.detectChanges();
      expect(component.canSubmit).toEqual(false);

      const mockAccountPasswordFormValue1 = {
        current: 'foo',
        new: '',
        confirm: '',
      };
      component.accountPasswordForm.setValue(mockAccountPasswordFormValue1);
      expect(component.canSubmit).toEqual(false);

      const mockAccountPasswordFormValue2 = {
        ...mockAccountPasswordFormValue1,
        new: 'bar',
      };
      component.accountPasswordForm.setValue(mockAccountPasswordFormValue2);
      expect(component.canSubmit).toEqual(false);

      const mockAccountPasswordFormValue3 = {
        ...mockAccountPasswordFormValue2,
        confirm: 'foobar',
      };
      component.accountPasswordForm.setValue(mockAccountPasswordFormValue3);
      expect(component.canSubmit).toEqual(false);

      const mockAccountPasswordFormValue4 = {
        ...mockAccountPasswordFormValue3,
        confirm: 'bar',
      };
      component.accountPasswordForm.setValue(mockAccountPasswordFormValue4);
      expect(component.canSubmit).toEqual(true);
    });
  });
});
