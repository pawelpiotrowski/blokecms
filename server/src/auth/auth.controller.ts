import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CookieOptions, Response } from 'express';
import * as ms from 'ms';
import { appConfig, appConfigNameSpace } from '../app.config';
import { AppConfig, AppConfigAuth, DotEnvVar } from '../app.config.interface';
import { UserInput } from '../user/user.dto';
import { AuthRefreshToken } from './auth-refresh-token.decorator';
import { AuthToken } from './auth-token.decorator';
import { AuthGuard } from './auth.guard';
import {
  AuthChangePasswordInput,
  AuthLoginResponse,
  AuthOkResponse,
} from './auth.interface';
import { AuthService } from './auth.service';

const { api } = appConfig();
const { auth, rateLimit } = api;
const { endpoints } = auth;
const { loginAttempts } = rateLimit;

@Controller(`${api.url}/${auth.url}`)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post(endpoints.whoami)
  @UseGuards(AuthGuard)
  whoami(@AuthToken() token: string) {
    return this.authService.whoami(token, this.authLoginResponse);
  }

  @Post(endpoints.role)
  @UseGuards(AuthGuard)
  async role(@AuthToken() token: string) {
    return this.authService.role(token);
  }

  @Post(endpoints.login)
  @UseGuards(ThrottlerGuard)
  @Throttle(loginAttempts.limit, loginAttempts.ttl)
  @SkipThrottle(rateLimit.disabled)
  async login(@Body() input: UserInput, @Res() response: Response) {
    const token = await this.authService.login(input);

    if (token === null) {
      this.authService.throwUnauthorized();
      return;
    }

    response
      .cookie(this.cookieName, token.auth, {
        ...this.cookieOptions,
        maxAge: this.cookieExpiryMs,
      })
      .cookie(this.refreshCookieName, token.refresh, {
        ...this.cookieOptions,
        maxAge: this.refreshCookieExpiryMs,
      })
      .send(this.authLoginResponse);
  }

  @Post(endpoints.logout)
  async logout(@Res() response: Response) {
    response
      .cookie(this.cookieName, '', {
        ...this.cookieOptions,
        maxAge: 0,
      })
      .cookie(this.refreshCookieName, '', {
        ...this.cookieOptions,
        maxAge: 0,
      })
      .send(this.authLogoutResponse);
  }

  @Post(endpoints.refresh)
  @UseGuards(AuthGuard)
  async refresh(
    @AuthRefreshToken() refreshToken: string,
    @Res() response: Response,
  ) {
    const token = await this.authService.refresh(refreshToken);

    if (token === null) {
      this.authService.throwUnauthorized();
      return;
    }
    response
      .cookie(this.cookieName, token, {
        ...this.cookieOptions,
        maxAge: this.cookieExpiryMs,
      })
      .send(this.authLoginResponse);
  }

  @Post(endpoints.pwdChange)
  @UseGuards(AuthGuard)
  async pwdChange(
    @AuthToken() token: string,
    @Body() input: AuthChangePasswordInput,
    @Res() response: Response,
  ) {
    const pwdChanged = await this.authService.changePassword(token, input);

    if (pwdChanged === null) {
      this.authService.throwUnauthorized();
      return;
    }

    await this.logout(response);
  }

  private get getAppConfig(): AppConfig {
    return this.configService.get<AppConfig>(appConfigNameSpace);
  }

  private get getAuthConfig(): AppConfigAuth {
    return this.getAppConfig.api.auth;
  }

  private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
      /**
       * With `secure` set to true cookie will be set only when https is on.
       * First check is for .env setting override and if not set
       * then https is required when running in production
       */
      secure:
        typeof this.getAuthConfig.requireHttps === 'boolean'
          ? this.getAuthConfig.requireHttps
          : this.getAppConfig.isProd,
    };
  }

  private get cookieName(): string {
    return this.configService.get<string>(DotEnvVar.authCookieName);
  }

  private get refreshCookieName(): string {
    return this.configService.get<string>(DotEnvVar.authRefreshCookieName);
  }

  private get cookieExpiryMs(): number {
    return ms(this.getAuthConfig.expiresIn);
  }

  private get refreshCookieExpiryMs(): number {
    return ms(this.getAuthConfig.refreshExpiresIn);
  }

  private get authLoginResponse(): AuthLoginResponse {
    return { expiresInMs: this.cookieExpiryMs };
  }

  private get authLogoutResponse(): AuthOkResponse {
    return { ok: true };
  }
}
