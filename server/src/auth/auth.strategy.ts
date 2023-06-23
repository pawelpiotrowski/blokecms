import { Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthTokenDecoded, AuthUserDecoded } from './auth.interface';
import { DotEnvVar } from '../app.config.interface';
import { appConfig } from '../app.config';
import { AuthService } from './auth.service';

export function extractTokenFromRequest(req: Request): string {
  return req.signedCookies[appConfig().api.auth.cookieName];
}

export function extractRefreshTokenFromRequest(req: Request): string {
  return req.signedCookies[appConfig().api.auth.refreshCookieName];
}

// Declared here to have access for testing
export function authStrategyJwtFromRequestHelper(
  // one of the nestjs config features is that it caches env vars
  // that is the reason it is passed as arg
  // instead of using `process.env[DotEnvVar.jwtKey]` in here
  config: ConfigService,
): StrategyOptions {
  return {
    jwtFromRequest: (req: Request) => {
      if (!req || !req.signedCookies) {
        return null;
      }
      return extractTokenFromRequest(req);
    },
    ignoreExpiration: false,
    secretOrKey: config.get<string>(DotEnvVar.jwtKey),
    passReqToCallback: true,
  };
}

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(authStrategyJwtFromRequestHelper(config));
  }

  validate(_: Request, data: AuthTokenDecoded): AuthUserDecoded {
    if (!data || !data.sub || !data.usr) {
      this.authService.throwUnauthorized();
    }
    return { _id: data.sub, username: data.usr };
  }
}
