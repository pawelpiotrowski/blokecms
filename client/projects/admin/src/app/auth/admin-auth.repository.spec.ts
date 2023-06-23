import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthRoleResponse, AuthService, AuthWhoAmIResponse } from 'shared-lib';
import { AdminAuthRepository } from './admin-auth.repository';

describe('AdminAuthRepository', () => {
  let repo: AdminAuthRepository;
  let authService: AuthService;
  const mockUser = {
    _id: '1',
    username: 'test',
    expiresInMs: 100,
  };
  const mockRole = {
    isAdmin: true,
  };
  const isAuthenticated$ = new BehaviorSubject<boolean | null>(null);
  const isExpired$ = new BehaviorSubject<boolean>(false);
  const whoAmI$ = new BehaviorSubject<AuthWhoAmIResponse>(mockUser);
  const role$ = new BehaviorSubject<AuthRoleResponse>(mockRole);
  const error$ = new BehaviorSubject<Error | null>(null);
  const mockAuthService = {
    isAuthenticated: jest.fn().mockReturnValue(isAuthenticated$),
    isExpired: jest.fn().mockReturnValue(isExpired$),
    whoAmI: jest.fn().mockReturnValue(whoAmI$),
    role: jest.fn().mockReturnValue(role$),
    error: error$.asObservable(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    });
    repo = TestBed.inject(AdminAuthRepository);
    authService = TestBed.inject(AuthService);
  });

  it('should create auth selectors', () => {
    expect(repo.user$).toBeInstanceOf(Observable);
    expect(repo.expired$).toBeInstanceOf(Observable);
    expect(repo.logout$).toBeInstanceOf(Observable);
    expect(repo.error$).toBeInstanceOf(Observable);
  });

  it('should subscribe to auth isAuthenticated and isExpired updates', () => {
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.isExpired).toHaveBeenCalled();
  });

  describe('user$', () => {
    it('should be set to null if NOT authenticated', (done) => {
      isAuthenticated$.next(false);
      repo.user$.subscribe((user) => {
        expect(user).toBeNull();
        done();
      });
    });

    it('should be set to whoami user and role if authenticated', (done) => {
      const { _id, username } = mockUser;
      const { isAdmin } = mockRole;
      isAuthenticated$.next(true);
      repo.user$.subscribe((user) => {
        expect(user).toEqual({ _id, username, isAdmin });
        done();
      });
    });
  });

  describe('expired$', () => {
    it('should be set to false if authenticated', (done) => {
      isAuthenticated$.next(true);
      repo.expired$.subscribe((expired) => {
        expect(expired).toEqual(false);
        done();
      });
    });

    it('should be set to expired value on update', (done) => {
      isExpired$.next(true);
      repo.expired$.subscribe((expired) => {
        expect(expired).toEqual(true);
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should be set to false if authenticated', (done) => {
      isAuthenticated$.next(true);
      repo.logout$.subscribe((logout) => {
        expect(logout).toEqual(false);
        done();
      });
    });

    it('should be set to logout value on update', (done) => {
      repo.updateLogout(true);
      repo.logout$.subscribe((logout) => {
        expect(logout).toEqual(true);
        done();
      });
    });
  });

  describe('error$', () => {
    it('should be set to error if there is auth error', (done) => {
      const mockError = new HttpErrorResponse({});
      error$.next(mockError);
      repo.error$.subscribe((error) => {
        expect(error).toEqual(mockError);
        done();
      });
    });
  });
});
