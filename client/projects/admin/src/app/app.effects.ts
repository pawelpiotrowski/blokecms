import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
  appDisplayInfoMessage,
} from './app.actions';

type AppMessageType = 'error' | 'success' | 'info';
type AppMessageTypeEmojiMap = {
  [key in AppMessageType]: string;
};

@Injectable({ providedIn: 'root' })
export class AppEffects {
  private readonly messageTypeEmojiMap: AppMessageTypeEmojiMap = {
    error: '❗',
    success: '✅',
    info: '💡',
  };

  constructor(private snackBar: MatSnackBar) {}

  displayErrorMessage$ = createEffect((actions) =>
    actions.pipe(
      ofType(appDisplayErrorMessage),
      tap((action) => this.displayMessage('error', action.payload.message)),
    ),
  );

  displaySuccessMessage$ = createEffect((actions) =>
    actions.pipe(
      ofType(appDisplaySuccessMessage),
      tap((action) => this.displayMessage('success', action.payload.message)),
    ),
  );

  displayInfoMessage$ = createEffect((actions) =>
    actions.pipe(
      ofType(appDisplayInfoMessage),
      tap((action) => this.displayMessage('info', action.payload.message)),
    ),
  );

  private displayMessage(type: AppMessageType, message: string) {
    this.snackBar.open(
      `${this.messageTypeEmojiMap[type]} ${message}`,
      undefined,
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      },
    );
  }
}
