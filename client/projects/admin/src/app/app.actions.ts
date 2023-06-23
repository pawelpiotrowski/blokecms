import { actionsFactory, payload } from '@ngneat/effects';

// We recommend using the actions factory to prefix each action
// for better readability and debug purposes when using redux dev tools
export const appActions = actionsFactory('App');

// We can declare an action by passing it a type and an optional payload.
export const appDisplayErrorMessage = appActions.create(
  'Display Error Message',
  payload<{ message: string }>(),
);

export const appDisplaySuccessMessage = appActions.create(
  'Display Success Message',
  payload<{ message: string }>(),
);

export const appDisplayInfoMessage = appActions.create(
  'Display Info Message',
  payload<{ message: string }>(),
);
