import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Actions,
  provideEffects,
  provideEffectsManager,
} from '@ngneat/effects-ng';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
  appDisplayInfoMessage,
} from './app.actions';
import { AppEffects } from './app.effects';

describe('AppEffects', () => {
  let snackBar: MatSnackBar;
  let testActionsStream = new Actions();
  const expectedSnackbarOptions = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        provideEffectsManager({
          customActionsStream: testActionsStream,
          dispatchByDefault: true,
        }),
        provideEffects(AppEffects),
      ],
    });
    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('displayMessage', () => {
    it('should display snack bar for error, success and info messages', () => {
      testActionsStream.dispatch(appDisplaySuccessMessage({ message: 'foo' }));
      expect(snackBar.open).toHaveBeenCalledWith(
        '✅ foo',
        undefined,
        expectedSnackbarOptions,
      );

      testActionsStream.dispatch(appDisplayErrorMessage({ message: 'test' }));
      expect(snackBar.open).toHaveBeenCalledWith(
        '❗ test',
        undefined,
        expectedSnackbarOptions,
      );

      testActionsStream.dispatch(appDisplayInfoMessage({ message: 'bar' }));
      expect(snackBar.open).toHaveBeenCalledWith(
        '💡 bar',
        undefined,
        expectedSnackbarOptions,
      );
    });
  });
});
