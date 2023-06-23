import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Strategy } from 'passport-jwt';
import { AppConfig } from '../app.config.interface';
import { appConfig, appConfigNameSpace } from '../app.config';
import { AuthTokenDecoded } from './auth.interface';
import { AuthService } from './auth.service';
import {
  AuthStrategy,
  authStrategyJwtFromRequestHelper,
  extractRefreshTokenFromRequest,
  extractTokenFromRequest,
} from './auth.strategy';
import { Types } from 'mongoose';

describe('AuthStrategy', () => {
  let service: AuthStrategy;
  let authService: AuthService;
  let configService: ConfigService;
  const mockAuthTokenDecoded: AuthTokenDecoded = {
    usr: 'test-user',
    sub: new Types.ObjectId(),
    iat: 1,
    exp: 2,
  };
  const mockAuthService = {
    throwUnauthorized: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [
        AuthStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<AuthStrategy>(AuthStrategy);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be configured as "jwt" strategy', () => {
    expect(service.name).toEqual('jwt');
    expect(service).toBeInstanceOf(Strategy);
  });

  describe('validate', () => {
    it('should return user _id and name extracted from jwt token', () => {
      const expectedUser = {
        _id: mockAuthTokenDecoded.sub,
        username: mockAuthTokenDecoded.usr,
      };
      expect(service.validate(null, mockAuthTokenDecoded)).toEqual(
        expectedUser,
      );
      expect(authService.throwUnauthorized).not.toBeCalled();
    });

    it('should throw unauthorized error via auth service if token payload or its props are falsy', () => {
      service.validate(null, {} as any);

      expect(authService.throwUnauthorized).toBeCalled();
    });
  });

  describe('authStrategyJwtFromRequestHelper', () => {
    it('should return strategy options for jwt passport strategy', () => {
      const strategyOptions = authStrategyJwtFromRequestHelper(configService);

      expect(strategyOptions).toEqual({
        jwtFromRequest: expect.any(Function),
        ignoreExpiration: false,
        passReqToCallback: true,
        secretOrKey: expect.any(String),
      });
    });

    describe('jwtFromRequest', () => {
      it('should return null for invalid request without signed cookies', () => {
        const strategyOptions = authStrategyJwtFromRequestHelper(configService);

        expect(strategyOptions.jwtFromRequest({} as any)).toBeNull();
      });

      it('should return cookie for valid request with signed cookies', () => {
        const strategyOptions = authStrategyJwtFromRequestHelper(configService);
        const config = appConfig();
        const signedCookies = {};
        signedCookies[config.api.auth.cookieName] = 'cookie';
        const mockValidRequest: any = { signedCookies };

        expect(strategyOptions.jwtFromRequest(mockValidRequest)).toEqual(
          'cookie',
        );
      });
    });
  });

  describe('extractTokenFromRequest', () => {
    it('should return auth token cookie from request', () => {
      const mockSignedCookie = {};
      mockSignedCookie[
        configService.get<AppConfig>(appConfigNameSpace).api.auth.cookieName
      ] = 'foo';

      expect(
        extractTokenFromRequest({ signedCookies: mockSignedCookie } as any),
      ).toEqual('foo');
    });
  });

  describe('extractRefreshTokenFromRequest', () => {
    it('should return auth refresh token cookie from request', () => {
      const mockSignedCookie = {};
      mockSignedCookie[
        configService.get<AppConfig>(
          appConfigNameSpace,
        ).api.auth.refreshCookieName
      ] = 'bar';

      expect(
        extractRefreshTokenFromRequest({
          signedCookies: mockSignedCookie,
        } as any),
      ).toEqual('bar');
    });
  });
});
