import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import {
  pageContentEntityDisableBackButton,
  pageContentEntityDisableCreateButton,
  pageContentEntityDisableDeleteButton,
  pageContentEntityDisableEditButton,
  pageContentEntityDisableResetButton,
  pageContentEntityDisableSaveButton,
  pageContentEntityEnableBackButton,
  pageContentEntityEnableCreateButton,
  pageContentEntityEnableDeleteButton,
  pageContentEntityEnableEditButton,
  pageContentEntityEnableResetButton,
  pageContentEntityEnableSaveButton,
} from './page-entity-content.actions';
import { PageEntityContentRepository } from './page-entity-content.repository';

@Injectable({ providedIn: 'root' })
export class PageEntityContentEffects {
  constructor(private entityRepo: PageEntityContentRepository) {}

  disableBackButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableBackButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Back: false })),
    ),
  );

  enableBackButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableBackButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Back: true })),
    ),
  );

  disableCreateButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableCreateButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Create: false })),
    ),
  );

  enableCreateButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableCreateButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Create: true })),
    ),
  );

  disableEditButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableEditButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Edit: false })),
    ),
  );

  enableEditButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableEditButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Edit: true })),
    ),
  );

  disableDeleteButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableDeleteButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Delete: false })),
    ),
  );

  enableDeleteButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableDeleteButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Delete: true })),
    ),
  );

  disableSaveButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableSaveButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Save: false })),
    ),
  );

  enableSaveButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableSaveButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Save: true })),
    ),
  );

  disableResetButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityDisableResetButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Reset: false })),
    ),
  );

  enableResetButton$ = createEffect((actions) =>
    actions.pipe(
      ofType(pageContentEntityEnableResetButton),
      tap(() => this.entityRepo.updateButtonsAvailability({ Reset: true })),
    ),
  );
}
