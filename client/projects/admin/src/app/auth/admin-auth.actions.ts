import { actionsFactory } from '@ngneat/effects';

// We recommend using the actions factory to prefix each action
// for better readability and debug purposes when using redux dev tools
export const adminAuthActions = actionsFactory('AdminAuth');

// We can declare an action by passing it a type and an optional payload.
export const adminAuthLogout = adminAuthActions.create('Logout');
export const adminAuthRedirectAuthenticated = adminAuthActions.create(
  'Redirect Authenticated',
);
export const adminAuthRedirectUnauthenticated = adminAuthActions.create(
  'Redirect Unauthenticated',
);
