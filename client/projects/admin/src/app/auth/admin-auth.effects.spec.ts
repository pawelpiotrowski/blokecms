import { TestBed } from '@angular/core/testing';
import {
  Actions,
  provideEffects,
  provideEffectsManager,
} from '@ngneat/effects-ng';
import { of } from 'rxjs';
import { AuthService } from 'shared-lib';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminAuthEffects } from './admin-auth.effects';
import {
  adminAuthLogout,
  adminAuthRedirectAuthenticated,
  adminAuthRedirectUnauthenticated,
} from './admin-auth.actions';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AdminAuthEffects', () => {
  let repo: AdminAuthRepository;
  let authService: AuthService;
  let router: Router;
  const mockAuthService = {
    logOut: jest.fn().mockReturnValue(of({ ok: true })),
  };
  const mockAdminAuthRepository = {
    updateLogout: jest.fn(),
  };
  // use a custom action stream to replace the stream before each test
  // It's recommended to only use this feature for testing purposes.
  let testActionsStream = new Actions();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AdminAuthRepository, useValue: mockAdminAuthRepository },
        provideEffectsManager({
          customActionsStream: testActionsStream,
          dispatchByDefault: true,
        }),
        provideEffects(AdminAuthEffects),
      ],
    });
    repo = TestBed.inject(AdminAuthRepository);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should trigger correct auth related function', () => {
    testActionsStream.dispatch(adminAuthLogout());
    expect(authService.logOut).toHaveBeenCalled();
    expect(repo.updateLogout).toHaveBeenLastCalledWith(true);

    jest.spyOn(router, 'navigate');

    testActionsStream.dispatch(adminAuthRedirectAuthenticated());
    expect(router.navigate).toHaveBeenLastCalledWith(['/dashboard']);

    testActionsStream.dispatch(adminAuthRedirectUnauthenticated());
    expect(router.navigate).toHaveBeenLastCalledWith(['/login']);
  });
});
