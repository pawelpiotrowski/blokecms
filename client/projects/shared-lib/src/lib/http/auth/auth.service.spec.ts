import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpService } from '../http.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;
  const httpServiceMock = {
    post: jest.fn().mockReturnValue(of({ expiresInMs: 10_000 })),
  };
  const mockUserInput = { username: 'foo', password: 'bar ' };
  const mockPwdChangeInput = { current: 'bar', new: 'foo', confirm: 'foo' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpService, useValue: httpServiceMock }],
    });
    service = TestBed.inject(AuthService);
    httpService = TestBed.inject(HttpService);
  });

  describe('init', () => {
    it('should verify whoAmI', () => {
      expect(httpService.post).toHaveBeenLastCalledWith(
        '/api/auth/whoami',
        null,
      );
    });
  });

  describe('login', () => {
    it('should call http post passing correct url and input', () => {
      service.logIn(mockUserInput);
      expect(httpService.post).toHaveBeenLastCalledWith(
        '/api/auth/login',
        mockUserInput,
      );
    });
  });

  describe('logout', () => {
    it('should call http post passing correct url and null as input', () => {
      service.logOut();
      expect(httpService.post).toHaveBeenLastCalledWith(
        '/api/auth/logout',
        null,
      );
    });
  });

  describe('whoAmI', () => {
    it('should call http post passing correct url and null as input', () => {
      service.whoAmI();
      expect(httpService.post).toHaveBeenLastCalledWith(
        '/api/auth/whoami',
        null,
      );
    });
  });

  describe('role', () => {
    it('should call http post passing correct url and null as input', () => {
      service.role();
      expect(httpService.post).toHaveBeenLastCalledWith('/api/auth/role', null);
    });
  });

  describe('isAuthenticated', () => {
    it('should return observable with true after successful login', (done) => {
      service.logIn(mockUserInput).subscribe();
      service.isAuthenticated().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toEqual(true);
        done();
      });
    });

    it('should return observable with true after successful whoAmI check', (done) => {
      service.whoAmI().subscribe();
      service.isAuthenticated().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toEqual(true);
        done();
      });
    });

    it('should return observable with false after successful logout', (done) => {
      service.logIn(mockUserInput).subscribe();
      service.logOut().subscribe();

      service.isAuthenticated().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toEqual(false);
        done();
      });
    });

    it('should return observable with false after req fails with 401 code', (done) => {
      service.logIn(mockUserInput).subscribe();

      const mockError = { status: 401 };
      (httpService.post as jest.Mock).mockReturnValueOnce(
        throwError(() => mockError),
      );

      service.logIn(mockUserInput).subscribe({ error: () => {} });

      service.isAuthenticated().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toEqual(false);
        done();
      });
    });

    it('should return observable with previous state after req fails', (done) => {
      service.logIn(mockUserInput).subscribe();

      const mockError = { status: 500 };
      (httpService.post as jest.Mock).mockReturnValueOnce(
        throwError(() => mockError),
      );

      service.logIn(mockUserInput).subscribe({ error: () => {} });

      service.isAuthenticated().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toEqual(true);
        done();
      });
    });
  });

  describe('isExpired', () => {
    it('should return observable with value false after successful login', (done) => {
      (httpService.post as jest.Mock).mockReturnValueOnce(
        of({ expiresInMs: 10 }),
      );
      service.logIn(mockUserInput).subscribe();
      service.isExpired().subscribe((isExpired) => {
        expect(isExpired).toEqual(false);
        done();
      });
    });
  });

  describe('changePassword', () => {
    it('should call http post passing correct url and input', () => {
      service.changePassword(mockPwdChangeInput);
      expect(httpService.post).toHaveBeenLastCalledWith(
        '/api/auth/pwd-change',
        mockPwdChangeInput,
      );
    });
  });
});
