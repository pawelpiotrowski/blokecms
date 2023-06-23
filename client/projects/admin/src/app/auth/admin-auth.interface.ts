import { HttpErrorResponse } from '@angular/common/http';
import { AuthRoleResponse, AuthWhoAmI } from 'shared-lib';

export type AdminAuthUserResolved = AuthWhoAmI & AuthRoleResponse;
export type AdminAuthUser = AdminAuthUserResolved | null | undefined;
export type AdminAuthExpired = boolean | undefined;
export type AdminAuthLogout = boolean | undefined;
export type AdminAuthError = HttpErrorResponse | undefined;

export interface AdminAuthProps {
  user: AdminAuthUser;
  expired: AdminAuthExpired;
  logout: AdminAuthLogout;
  error: AdminAuthError;
}
