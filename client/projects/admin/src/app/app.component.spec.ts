import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { adminAuthRedirectUnauthenticated } from './auth/admin-auth.actions';
import {
  AdminAuthExpired,
  AdminAuthLogout,
  AdminAuthUser,
} from './auth/admin-auth.interface';
import { AdminAuthRepository } from './auth/admin-auth.repository';
import { LoginFormComponent } from './features/login/form/login-form.component';
import { LoginFormModule } from './features/login/form/login-form.module';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';

describe('Admin AppComponent', () => {
  let repo: AdminAuthRepository;
  let matDialog: MatDialog;
  let actions: Actions;
  const expired$ = new BehaviorSubject<AdminAuthExpired>(undefined);
  const logout$ = new BehaviorSubject<AdminAuthLogout>(undefined);
  const user$ = new BehaviorSubject<AdminAuthUser>(null);
  const mockAdminAuthRepository = {
    expired$,
    logout$,
    user$,
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent },
        ]),
        LoginFormModule,
        MainLayoutModule,
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();
    repo = TestBed.inject(AdminAuthRepository);
    matDialog = TestBed.inject(MatDialog);
    actions = TestBed.inject(Actions);
    jest.spyOn(repo.expired$, 'subscribe');
    jest.spyOn(repo.logout$, 'subscribe');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'admin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('admin');
  });

  describe('ngOnInit', () => {
    it('should subscribe to auth admin repo expired$ and logout updates', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(repo.expired$.subscribe).toHaveBeenCalled();
      expect(repo.logout$.subscribe).toHaveBeenCalled();
    });

    it('should open login dialog when admin auh expires', () => {
      const fixture = TestBed.createComponent(AppComponent);
      jest.spyOn(matDialog, 'open');
      fixture.detectChanges();
      expect(matDialog.open).not.toHaveBeenCalled();

      expired$.next(true);

      expect(matDialog.open).toHaveBeenLastCalledWith(LoginFormComponent, {
        width: '40vw',
        disableClose: true,
        closeOnNavigation: false,
        panelClass: 'app-login-prompt',
        backdropClass: 'app-login-backdrop',
      });
    });

    it('should dispatch redirect action when admin auh logs out', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      expect(actions.dispatch).not.toHaveBeenCalled();

      logout$.next(true);

      expect(actions.dispatch).toHaveBeenLastCalledWith(
        adminAuthRedirectUnauthenticated(),
      );
    });
  });
});
