import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { isEmpty } from 'shared-lib';
import { PageContentConfirmDialogComponent } from '../page-content-confirm-dialog/page-content-confirm-dialog.component';
import {
  PageContentEntityBackButtonSubject,
  PageContentEntityQueryParams,
  PageContentEntityToolbarButtons,
  PageContentEntityToolbarButtonsAvailability,
} from './page-content-entity-layout.interface';
import { PageEntityContentRepository } from './page-entity-content.repository';

@Component({
  selector: 'admin-page-content-entity-layout',
  templateUrl: './page-content-entity-layout.component.html',
  styleUrls: ['./page-content-entity-layout.component.scss'],
})
export class PageContentEntityLayoutComponent implements OnInit, OnDestroy {
  @Input() loading!: boolean;
  @Input() parentRouteLabel!: string;
  @Input() parentRoute!: string;
  @Input() parentRouteRelative!: boolean;
  @Input() entityLabel!: string;
  @Input() entityId!: string;
  @Input() entityActionConfirmLabel!: string;
  @Input() isNew!: boolean;
  @Input() isEdit!: boolean;
  @Input() isView!: boolean;
  buttonsAvailability!: PageContentEntityToolbarButtonsAvailability;

  private entityRepoSubscriptions = new Subscription();
  private backButtonSubject =
    new BehaviorSubject<PageContentEntityBackButtonSubject | null>(null);

  constructor(
    private entityRepo: PageEntityContentRepository,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.entityRepoSubscriptions.add(
      this.entityRepo.buttonsAvailability$.subscribe(
        this.buttonsAvailabilityHandler.bind(this),
      ),
    );
    this.entityRepoSubscriptions.add(
      this.activeRoute.queryParams.subscribe(
        this.queryParamsHandler.bind(this),
      ),
    );
  }

  ngOnDestroy() {
    this.entityRepoSubscriptions.unsubscribe();
    this.backButtonSubject.next(null);
    this.entityRepo.reset();
  }

  saveButtonHandler() {
    this.entityRepo.updateButtonsAction(PageContentEntityToolbarButtons.Save);
  }

  resetButtonHandler() {
    this.entityRepo.updateButtonsAction(PageContentEntityToolbarButtons.Reset);
  }

  deleteButtonHandler() {
    this.openConfirmDeleteDialog();
  }

  get getBackButtonRoute() {
    return this.backButtonSubject.asObservable();
  }

  private buttonsAvailabilityHandler(
    availability: PageContentEntityToolbarButtonsAvailability,
  ) {
    this.buttonsAvailability = availability;
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  private queryParamsHandler(params: Params) {
    const defaultRoutePrefix = this.parentRouteRelative === true ? './' : '/';
    const defaultRoute = defaultRoutePrefix + this.parentRoute;
    const defaultBackButton = {
      route: [defaultRoute],
      query: null,
      label: this.parentRouteLabel,
    };

    if (isEmpty(params)) {
      this.backButtonSubject.next(defaultBackButton);
      return;
    }
    const queryParams = params as PageContentEntityQueryParams;

    if (isEmpty(queryParams.parent)) {
      this.backButtonSubject.next(defaultBackButton);
      return;
    }

    const query =
      queryParams.pageId && queryParams.pageId.length > 1
        ? { pageId: queryParams.pageId }
        : null;

    this.backButtonSubject.next({
      route: [`/${queryParams.parent}`, queryParams.id as string, 'edit'],
      query,
      label: 'Back',
    });
  }

  private openConfirmDeleteDialog() {
    this.dialog
      .open(PageContentConfirmDialogComponent, {
        closeOnNavigation: true,
        data: {
          message: `Are you sure you want to delete "${
            this.entityActionConfirmLabel || this.entityLabel
          }"?`,
          payload: true,
        },
      })
      .afterClosed()
      .subscribe(this.confirmDialogAfterClosedHandler.bind(this));
  }

  private confirmDialogAfterClosedHandler(result: true | null) {
    if (result == null) {
      return;
    }
    this.entityRepo.updateButtonsAction(PageContentEntityToolbarButtons.Delete);
  }
}
