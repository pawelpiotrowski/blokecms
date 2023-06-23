import { User } from 'src/user/user.schema';
import { AppSchemaId } from '../common/common.interface';

interface TokenDecoded {
  iat: number;
  exp: number;
}

export interface AuthTokenPayload {
  usr: string;
  sub: AppSchemaId;
}

export interface AuthRefreshTokenPayload extends AuthTokenPayload {
  ref: true;
}

export type AuthTokenDecoded = AuthTokenPayload & TokenDecoded;
export type AuthRefreshTokenDecoded = AuthRefreshTokenPayload & TokenDecoded;

export interface AuthLoginToken {
  auth: string;
  refresh: string;
}

export interface AuthLoginResponse {
  expiresInMs: number;
}

export type AuthUserDecoded = Pick<User, '_id' | 'username'>;

export type AuthWhoAmIPayload = AuthUserDecoded & AuthLoginResponse;

export interface AuthOkResponse {
  ok: boolean;
}

export interface AuthChangePasswordInput {
  current: string;
  new: string;
  confirm: string;
}
