export interface AuthLoginInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  expiresInMs: number;
}

export interface AuthWhoAmI {
  _id: string;
  username: string;
}

export type AuthWhoAmIResponse = AuthResponse & AuthWhoAmI;

export interface AuthLogoutResponse {
  ok: true;
}

export interface AuthRoleResponse {
  isAdmin: boolean;
}

export interface AuthChangePasswordInput {
  current: string;
  new: string;
  confirm: string;
}
