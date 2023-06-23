import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Actions } from '@ngneat/effects-ng';
import { of, throwError } from 'rxjs';
import { AuthService, LoggerService } from 'shared-lib';
import { appDisplayErrorMessage } from '../../../app.actions';
import { adminAuthRedirectAuthenticated } from '../../../auth/admin-auth.actions';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: AuthService;
  let formBuilder: UntypedFormBuilder;
  let logger: LoggerService;
  let actions: Actions;
  const mockAuthService = {
    logIn: jest.fn(),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    formBuilder = TestBed.inject(UntypedFormBuilder);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
  });

  describe('ngOnInit', () => {
    it('should create login form', () => {
      jest.spyOn(formBuilder, 'group');
      const expectedFormValidators = [
        '',
        [expect.any(Function), expect.any(Function)],
      ];

      fixture.detectChanges();

      expect(component.loginForm).toBeInstanceOf(UntypedFormGroup);
      expect(formBuilder.group).toBeCalledWith({
        username: expectedFormValidators,
        password: expectedFormValidators,
      });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return early if form can not be submitted or is processing', () => {
      const mockEvent: any = { preventDefault: jest.fn() };

      jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(false);
      component.onSubmit(mockEvent);

      jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(true);
      component.loginProcessing = true;
      component.onSubmit(mockEvent);

      expect(authService.logIn).not.toBeCalled();
      expect(mockEvent.preventDefault).toBeCalledTimes(2);
    });

    it('should call auth logIn and set processing flag to true if form can be submitted and is NOT processing', () => {
      const mockEvent: any = { preventDefault: jest.fn() };
      expect(component.loginProcessing).toEqual(false);
      (authService.logIn as jest.Mock).mockReturnValueOnce(
        of({ expiresInMs: 1 }),
      );
      jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(true);

      component.onSubmit(mockEvent);

      expect(component.loginProcessing).toEqual(true);
      expect(authService.logIn).toBeCalledWith(component.loginForm.value);
      expect(mockEvent.preventDefault).toBeCalledTimes(1);
    });

    describe('on successful logIn', () => {
      describe('as standalone component', () => {
        it('should emit emitLogIn event', () => {
          const mockEvent: any = { preventDefault: jest.fn() };
          (authService.logIn as jest.Mock).mockReturnValueOnce(
            of({ expiresInMs: 1 }),
          );
          jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(true);

          component.onSubmit(mockEvent);

          expect(actions.dispatch).toHaveBeenLastCalledWith(
            adminAuthRedirectAuthenticated(),
          );
        });
      });

      describe('as dialog component', () => {
        it('should close dialog', () => {
          const mockEvent: any = { preventDefault: jest.fn() };
          (authService.logIn as jest.Mock).mockReturnValueOnce(
            of({ expiresInMs: 1 }),
          );
          jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(true);
          (actions.dispatch as jest.Mock).mockClear();
          component.dialogRef = { close: jest.fn() } as any;

          component.onSubmit(mockEvent);

          expect(actions.dispatch).not.toHaveBeenCalled();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
      });
    });

    describe('on login error', () => {
      it('should log the error toggle hasError flag and set login processing to false', fakeAsync(() => {
        const mockEvent: any = { preventDefault: jest.fn() };
        (authService.logIn as jest.Mock).mockReturnValueOnce(
          throwError(() => ({ status: 500 })),
        );
        jest.spyOn(component, 'canSubmit', 'get').mockReturnValueOnce(true);
        jest.spyOn(component.loginForm, 'reset');

        component.onSubmit(mockEvent);
        expect(component.hasError).toEqual(true);
        expect(logger.error).toHaveBeenLastCalledWith(
          'Error on user login',
          LoginFormComponent.name,
          { status: 500 },
        );

        expect(component.loginProcessing).toEqual(false);
        tick(400);
        expect(component.hasError).toEqual(false);
        expect(component.loginForm.reset).toHaveBeenCalled();
        expect(actions.dispatch).toHaveBeenLastCalledWith(
          appDisplayErrorMessage({
            message: 'Please check your credentials and try again',
          }),
        );
      }));
    });
  });

  describe('togglePwdInputHide', () => {
    it('should toggle password visibility flag', () => {
      fixture.detectChanges();
      expect(component.pwdInputHide).toEqual(true);
      component.togglePwdInputHide();
      expect(component.pwdInputHide).toEqual(false);
      component.togglePwdInputHide();
      expect(component.pwdInputHide).toEqual(true);
    });
  });
});
