import { createStore, withProps, select, filterNil } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
  PageContentEntityToolbarButtonsAvailability,
  pageContentEntityToolbarButtonsAvailabilityDefault,
  PageEntityContentProps,
} from './page-content-entity-layout.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageEntityContentRepository {
  buttonsAvailability$: Observable<PageContentEntityToolbarButtonsAvailability>;
  buttonsAction$: Observable<PageContentEntityToolbarButtonAction>;
  private readonly storeName = 'pageEntityContent';
  private store;

  constructor() {
    this.store = this.createStore();
    this.buttonsAvailability$ = this.store.pipe(
      select((state) => state.buttonsAvailability),
    );
    this.buttonsAction$ = this.store.pipe(
      select((state) => state.buttonsAction),
      filterNil(),
    );
  }

  updateButtonsAvailability(
    availability: Partial<PageContentEntityToolbarButtonsAvailability>,
  ) {
    this.store.update((state) => ({
      ...state,
      buttonsAvailability: {
        ...state.buttonsAvailability,
        ...availability,
      },
    }));
  }

  updateButtonsAction(action: PageContentEntityToolbarButtons) {
    this.store.update((state) => ({
      ...state,
      buttonsAction: action,
    }));
    // clean action to allow same action be triggered again
    this.store.update((state) => ({
      ...state,
      buttonsAction: null,
    }));
  }

  reset() {
    this.store.reset();
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: this.storeName },
      withProps<PageEntityContentProps>({
        buttonsAvailability: pageContentEntityToolbarButtonsAvailabilityDefault,
        buttonsAction: null,
      }),
    );

    return store;
  }
}
