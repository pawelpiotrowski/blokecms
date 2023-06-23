import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as ms from 'ms';
import { mockUserInput } from '../../test/helpers/user.dto.helper';
import { DotEnvVar } from '../app.config.interface';
import { appConfig, appConfigNameSpace } from '../app.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ThrottlerModule } from '@nestjs/throttler';

const mockAuthService = {
  login: jest.fn(),
  refresh: jest.fn(),
  whoami: jest.fn(),
  role: jest.fn(),
  throwUnauthorized: jest.fn(),
  changePassword: jest.fn(),
};

const config = appConfig();
const mockConfigService = {
  get: (arg: string) => {
    if (arg === appConfigNameSpace) {
      return config;
    }
    return mockConfigService[arg];
  },
};
mockConfigService[DotEnvVar.authCookieName] = 'test-auth-cookie-name';
mockConfigService[DotEnvVar.authRefreshCookieName] =
  'test-auth-refresh-cookie-name';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const createUserInput = mockUserInput();
  const mockResponse: any = {
    cookie: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ThrottlerModule.forRoot({
          ttl: 100,
          limit: 100,
        }),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    // mainly mockResponse spies
    jest.clearAllMocks();
  });

  describe('whoami', () => {
    it('should return decoded user info from token', () => {
      const mockDecodedUser = {
        _id: 'foo',
        username: 'bar',
        expiresInMs: 100,
      };
      (authService.whoami as jest.Mock).mockReturnValueOnce(mockDecodedUser);

      const result = controller.whoami('some-token');

      expect(authService.whoami).toHaveBeenLastCalledWith('some-token', {
        expiresInMs: ms(config.api.auth.expiresIn),
      });
      expect(result).toEqual(mockDecodedUser);
    });
  });

  describe('role', () => {
    it('should return decoded user isAdmin prop', async () => {
      const mockDecodedUserRole = {
        isAdmin: true,
      };
      (authService.role as jest.Mock).mockResolvedValueOnce(
        mockDecodedUserRole,
      );

      const result = await controller.role('some-token');

      expect(authService.role).toHaveBeenLastCalledWith('some-token');
      expect(result).toEqual(mockDecodedUserRole);
    });
  });

  describe('login', () => {
    describe('when successful', () => {
      it('should send auth login response with auth and refresh cookies, options and tokens', async () => {
        const expectedAuthToken = 'the-token';
        const expectedRefreshToken = 'the-refresh-token';
        const expectedTokenPayload = {
          auth: expectedAuthToken,
          refresh: expectedRefreshToken,
        };
        const spyOnAuthServiceLogin = jest
          .spyOn(authService, 'login')
          .mockResolvedValue(expectedTokenPayload);
        const expectedCookieName = mockConfigService[DotEnvVar.authCookieName];
        const expectedRefreshCookieName =
          mockConfigService[DotEnvVar.authRefreshCookieName];
        const expectedCookieOptions = {
          httpOnly: true,
          sameSite: 'strict',
          signed: true,
          secure: config.isProd,
          maxAge: ms(config.api.auth.expiresIn),
        };
        const expectedRefreshCookieOptions = {
          ...expectedCookieOptions,
          maxAge: ms(config.api.auth.refreshExpiresIn),
        };

        await controller.login(createUserInput, mockResponse);

        expect(spyOnAuthServiceLogin).toBeCalledWith(createUserInput);
        expect(authService.throwUnauthorized).not.toBeCalled();
        expect(mockResponse.cookie).toBeCalledTimes(2);
        expect(mockResponse.cookie).toHaveBeenNthCalledWith(
          1,
          expectedCookieName,
          expectedAuthToken,
          expectedCookieOptions,
        );
        expect(mockResponse.cookie).toHaveBeenNthCalledWith(
          2,
          expectedRefreshCookieName,
          expectedRefreshToken,
          expectedRefreshCookieOptions,
        );
        expect(mockResponse.send).toHaveBeenLastCalledWith({
          expiresInMs: ms(config.api.auth.expiresIn),
        });
      });
    });

    describe('when not successful', () => {
      it('should return early and throw via service', async () => {
        const spyOnAuthServiceLogin = jest
          .spyOn(authService, 'login')
          .mockResolvedValue(null);

        await controller.login(createUserInput, mockResponse);

        expect(spyOnAuthServiceLogin).toBeCalledWith(createUserInput);
        expect(authService.throwUnauthorized).toBeCalled();
        expect(mockResponse.cookie).not.toBeCalled();
        expect(mockResponse.send).not.toBeCalled();
      });
    });
  });

  describe('logout', () => {
    it('should clear auth cookie', async () => {
      const expectedToken = '';
      const expectedCookieName = mockConfigService[DotEnvVar.authCookieName];
      const expectedRefreshCookieName =
        mockConfigService[DotEnvVar.authRefreshCookieName];
      const expectedCookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        signed: true,
        secure: config.isProd,
        maxAge: 0,
      };

      await controller.logout(mockResponse);

      expect(mockResponse.cookie).toBeCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenNthCalledWith(
        1,
        expectedCookieName,
        expectedToken,
        expectedCookieOptions,
      );
      expect(mockResponse.cookie).toHaveBeenNthCalledWith(
        2,
        expectedRefreshCookieName,
        expectedToken,
        expectedCookieOptions,
      );
      expect(mockResponse.send).toHaveBeenLastCalledWith({
        ok: true,
      });
    });
  });

  describe('refresh', () => {
    describe('when successful', () => {
      it('should send auth login response with auth cookie name, options and token', async () => {
        const mockRefreshToken = 'refresh-token';
        const expectedAuthToken = 'the-token';
        const spyOnAuthServiceRefresh = jest
          .spyOn(authService, 'refresh')
          .mockResolvedValue(expectedAuthToken);
        const expectedCookieName = mockConfigService[DotEnvVar.authCookieName];
        const expectedCookieOptions = {
          httpOnly: true,
          sameSite: 'strict',
          signed: true,
          secure: config.isProd,
          maxAge: ms(config.api.auth.expiresIn),
        };

        await controller.refresh(mockRefreshToken, mockResponse);

        expect(spyOnAuthServiceRefresh).toBeCalledWith(mockRefreshToken);
        expect(authService.throwUnauthorized).not.toBeCalled();
        expect(mockResponse.cookie).toBeCalledTimes(1);
        expect(mockResponse.cookie).toHaveBeenLastCalledWith(
          expectedCookieName,
          expectedAuthToken,
          expectedCookieOptions,
        );
        expect(mockResponse.send).toHaveBeenLastCalledWith({
          expiresInMs: ms(config.api.auth.expiresIn),
        });
      });
    });

    describe('when not successful', () => {
      it('should return early and throw via service', async () => {
        const mockRefreshToken = 'foo';
        const spyOnAuthServiceRefresh = jest
          .spyOn(authService, 'refresh')
          .mockResolvedValue(null);

        await controller.refresh(mockRefreshToken, mockResponse);

        expect(spyOnAuthServiceRefresh).toBeCalledWith(mockRefreshToken);
        expect(authService.throwUnauthorized).toBeCalled();
        expect(mockResponse.cookie).not.toBeCalled();
        expect(mockResponse.send).not.toBeCalled();
      });
    });
  });

  describe('pwdChange', () => {
    const mockPwdChangeInput = {
      current: 'pwd123',
      new: 'foo123',
      confirm: 'foo123',
    };
    it('should throw unauthorized when service returns null', async () => {
      (authService.changePassword as jest.Mock).mockResolvedValueOnce(null);

      await controller.pwdChange('token', mockPwdChangeInput, mockResponse);
      expect(authService.changePassword).toHaveBeenLastCalledWith(
        'token',
        mockPwdChangeInput,
      );
      expect(authService.throwUnauthorized).toHaveBeenCalledTimes(1);
    });

    it('should log user out when successful', async () => {
      (authService.changePassword as jest.Mock).mockResolvedValueOnce(
        {} as any,
      );
      (authService.throwUnauthorized as jest.Mock).mockClear();
      jest.spyOn(controller, 'logout').mockResolvedValueOnce({} as any);

      await controller.pwdChange('token', mockPwdChangeInput, mockResponse);

      expect(authService.throwUnauthorized).not.toHaveBeenCalled();
      expect(controller.logout).toHaveBeenLastCalledWith(mockResponse);
    });
  });
});
