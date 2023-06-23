import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngneat/effects-ng';
import { of } from 'rxjs';
import { AuthService, LoggerService } from 'shared-lib';
import { adminAuthRedirectAuthenticated } from './admin-auth.actions';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminRoleAdminGuard } from './admin-role-admin.guard';

describe('AdminRoleAdminGuard', () => {
  let guard: AdminRoleAdminGuard;
  let authService: AuthService;
  let logger: LoggerService;
  let actions: Actions;
  const mockAuthService = {
    isAuthenticated: jest.fn(),
    role: jest.fn(),
  };
  const mockLoggerService = {
    log: jest.fn(),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminAuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    });
    guard = TestBed.inject(AdminRoleAdminGuard);
    authService = TestBed.inject(AuthService);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
  });

  describe('canLoad', () => {
    it('should return false if user is unauthenticated and dispatch redirect action', (done) => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValueOnce(of(true));
      jest
        .spyOn(authService, 'role')
        .mockReturnValueOnce(of({ isAdmin: false }));
      guard.canLoad().subscribe((canLoad) => {
        expect(canLoad).toEqual(false);
        expect(actions.dispatch).toHaveBeenLastCalledWith(
          adminAuthRedirectAuthenticated(),
        );
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });

    it('should return true if user is authenticated and NOT dispatch redirect action', (done) => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValueOnce(of(true));
      jest
        .spyOn(authService, 'role')
        .mockReturnValueOnce(of({ isAdmin: true }));
      (actions.dispatch as jest.Mock).mockClear();
      guard.canLoad().subscribe((canLoad) => {
        expect(canLoad).toEqual(true);
        expect(actions.dispatch).not.toHaveBeenCalled();
        expect(logger.log).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('canActivate', () => {
    it('should return canLoad', (done) => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValueOnce(of(true));
      jest
        .spyOn(authService, 'role')
        .mockReturnValueOnce(of({ isAdmin: true }));
      jest.spyOn(guard, 'canLoad');
      guard.canActivate().subscribe((canLoad) => {
        expect(guard.canLoad).toHaveBeenCalled();
        done();
      });
    });
  });
});
