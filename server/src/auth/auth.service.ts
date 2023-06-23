import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { appConfigNameSpace } from '../app.config';
import { AppConfig, DotEnvVar } from '../app.config.interface';
import { User } from '../user/user.schema';
import { UserInput } from '../user/user.dto';
import { UserService } from '../user/user.service';
import {
  AuthChangePasswordInput,
  AuthLoginResponse,
  AuthLoginToken,
  AuthRefreshTokenPayload,
  AuthTokenDecoded,
  AuthTokenPayload,
  AuthWhoAmIPayload,
} from './auth.interface';

@Injectable()
export class AuthService {
  private readonly unauthorizedExceptionMsg = 'Not authorized';
  private readonly forbiddenExceptionMsg = 'Not enough privileges';
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(input: UserInput): Promise<AuthLoginToken | null> {
    const verified = await this.userService.verify(input);

    if (verified === null) {
      return null;
    }
    return this.getAuthLoginToken(verified);
  }

  async refresh(refreshToken: string): Promise<string | null> {
    try {
      const { sub, usr } = await this.jwtService.verifyAsync(
        refreshToken,
        this.authRefreshTokenVerifyOptions,
      );
      const exists = await this.userService.exists({ _id: sub });

      return exists ? this.getAuthToken({ sub, usr }) : null;
    } catch (e) {
      return null;
    }
  }

  whoami(
    token: string,
    partialPayload?: AuthLoginResponse,
  ): AuthWhoAmIPayload | null {
    const authTokenDecoded = this.decodeAuthToken(token);

    if (authTokenDecoded === null) {
      return null;
    }

    const { usr, exp, sub } = authTokenDecoded;
    const epochTimeNow = Math.floor(new Date().getTime() / 1000);

    Logger.log(
      `auth whoami expiry in ${exp - epochTimeNow}s`,
      AuthService.name,
    );

    // != compares against null and undefined
    if (partialPayload != undefined) {
      partialPayload.expiresInMs = (exp - epochTimeNow) * 1000;
    }

    return {
      _id: sub,
      username: usr,
      ...partialPayload,
    };
  }

  async role(token: string) {
    const authTokenDecoded = this.decodeAuthToken(token);

    if (authTokenDecoded === null) {
      return null;
    }
    const { sub: _id } = authTokenDecoded;
    const user = await this.userService.findOne({ _id });
    const isAdmin = (user != null && user.isAdmin) || false;

    return { isAdmin };
  }

  async changePassword(
    token: string,
    input: AuthChangePasswordInput,
  ): Promise<AuthWhoAmIPayload | null> {
    if (input.new !== input.confirm) {
      return null;
    }

    const user = this.whoami(token);
    const verify = await this.userService.verify({
      username: user.username,
      password: input.current,
    });

    if (verify == null) {
      return null;
    }

    await this.userService.update({
      _id: user._id,
      password: input.new,
    });

    return user;
  }

  throwUnauthorized(): void {
    throw new UnauthorizedException(this.unauthorizedExceptionMsg);
  }

  throwForbidden(): void {
    throw new ForbiddenException(this.forbiddenExceptionMsg);
  }

  private decodeAuthToken(token: string): AuthTokenDecoded | null {
    const authTokenDecoded = this.jwtService.decode(token);
    // == compares against null and undefined
    if (authTokenDecoded == null || typeof authTokenDecoded === 'string') {
      return null;
    }
    return authTokenDecoded as AuthTokenDecoded;
  }

  private async getAuthLoginToken(forUser: User): Promise<AuthLoginToken> {
    const authPayload = this.getAuthTokenPayload(forUser);
    const authRefreshPaylaod: AuthRefreshTokenPayload = {
      ...authPayload,
      ref: true,
    };

    return {
      auth: await this.getAuthToken(authPayload),
      refresh: await this.jwtService.signAsync(
        authRefreshPaylaod,
        this.authRefreshTokenSignOptions,
      ),
    };
  }

  private getAuthTokenPayload(forUser: User): AuthTokenPayload {
    return {
      sub: forUser._id,
      usr: forUser.username,
    };
  }

  private async getAuthToken(forPayload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(forPayload);
  }

  private get authRefreshTokenSignOptions(): JwtSignOptions {
    const config = this.configService.get<AppConfig>(appConfigNameSpace);

    return {
      secret: this.authTokenSecret,
      expiresIn: config.api.auth.refreshExpiresIn,
    };
  }

  private get authRefreshTokenVerifyOptions(): JwtVerifyOptions {
    return {
      secret: this.authTokenSecret,
    };
  }

  private get authTokenSecret() {
    return this.configService.get<string>(DotEnvVar.jwtKey);
  }
}
