import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, of } from 'rxjs';
import { adminAuthRedirectAuthenticated } from '../../auth/admin-auth.actions';
import { AdminAuthError, AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let adminAuthRepository: AdminAuthRepository;
  let actions: Actions;
  const user$ = new BehaviorSubject<AdminAuthUser>(undefined);
  const error$ = new BehaviorSubject<AdminAuthError>(undefined);
  const mockAdminAuthRepository = {
    user$,
    error$,
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
        ]),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    adminAuthRepository = TestBed.inject(AdminAuthRepository);
    actions = TestBed.inject(Actions);
  });

  describe('ngOnInit', () => {
    it('should subscribe to auth repo user updates', () => {
      jest.spyOn(adminAuthRepository.user$, 'subscribe');
      fixture.detectChanges();
      expect(adminAuthRepository.user$.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('authRepoUserHandler', () => {
    it('should set isUserResolved to true if user is null and NOT dispatch redirect action', () => {
      expect(component.isUserResolved).toBe(false);
      fixture.detectChanges();
      user$.next(null);
      expect(component.isUserResolved).toBe(true);
      expect(actions.dispatch).not.toBeCalled();
    });

    it('should dispatch redirect action if user is NOT null and not set isUserResolved flag', () => {
      user$.next({ username: 'test', _id: '1', isAdmin: false });
      fixture.detectChanges();
      expect(component.isUserResolved).toBe(false);
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        adminAuthRedirectAuthenticated(),
      );
    });
  });

  describe('authErrorHandler', () => {
    it('should set error message on error', () => {
      fixture.detectChanges();
      error$.next(new HttpErrorResponse({}));

      const compiled = fixture.nativeElement as HTMLElement;
      const compiledErrorTag = compiled.querySelector('h2');

      expect(compiledErrorTag?.textContent?.trim()).toEqual(
        'B Oops there was an error, please try to log in',
      );
    });
  });
});
