import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Mutation, Query } from 'apollo-angular';
import { filter, take, Subscription } from 'rxjs';
import { Actions } from '@ngneat/effects-ng';
import { PageContentEntityToolbarButtons } from '../page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../page-content-entity-layout/page-entity-content.repository';
import { appDisplaySuccessMessage } from '../../app.actions';

@Component({ template: '' })
export abstract class PageWithChildDrawerChildComponent<T, V>
  implements OnDestroy, OnInit
{
  loading!: boolean;
  backButtonLabel!: string;
  backButtonRoute!: string;
  entityLabel!: string;
  entityId!: string;
  isNew = false;
  isEdit = false;
  isView = false;
  protected dataModel!: T;
  protected dataSource!: Query<T>;
  protected dataSourceUpdateFunction!: (data: T) => void;
  protected dataDeleteSource!: Mutation<V>;
  private dataSubscription!: Subscription;
  private subscriptions = new Subscription();

  constructor(
    protected entityRepo: PageEntityContentRepository,
    private route: ActivatedRoute,
    private router: Router,
    private actions: Actions,
  ) {}

  ngOnInit() {
    this.setDataAndViewType();
    this.setDeleteButtonSubscription();
    this.route.params.subscribe(this.setDataAndViewType.bind(this));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  protected redirectWithRefetch(url: string) {
    return this.router.navigateByUrl(url, { state: { refetch: true } });
  }

  private setDataAndViewType() {
    const { snapshot } = this.route;
    const { params } = snapshot;

    this.backButtonLabel = this.getBackButtonLabel(snapshot);
    this.backButtonRoute = this.getBackButtonRoute(snapshot);
    this.entityId = params['id'];
    this.setViewType();

    if (this.isNew) {
      this.dataSourceUpdateFunction(this.dataModel);
      return;
    }
    this.setDataSubscription();
  }

  private setViewType() {
    this.isNew = this.entityId == null;
    // url is UrlSegment[] not a string
    this.isEdit = this.route.snapshot.url.length > 1;
    this.isView = this.isNew === false && this.isEdit === false;
  }

  private setDataSubscription() {
    this.dataSubscription = this.dataSource
      .fetch(
        { input: { _id: this.entityId } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      )
      // TODO handle errors
      .subscribe(({ data, loading, errors }) => {
        if (!loading) {
          this.dataSourceUpdateFunction(data);
        }
        this.loading = loading;
      });
    this.subscriptions.add(this.dataSubscription);
  }

  private getBackButtonLabel(snapshot: ActivatedRouteSnapshot): string {
    if (
      !snapshot.parent ||
      !snapshot.parent.data ||
      !snapshot.parent.data['title']
    ) {
      return '';
    }
    return snapshot.parent.data['title'];
  }

  private getBackButtonRoute(snapshot: ActivatedRouteSnapshot): string {
    if (
      !snapshot.parent ||
      !snapshot.parent.parent ||
      !snapshot.parent.parent.routeConfig ||
      !snapshot.parent.parent.routeConfig.path
    ) {
      return '';
    }
    return snapshot.parent.parent.routeConfig.path;
  }

  private setDeleteButtonSubscription() {
    const entityRepoSubscription = this.entityRepo.buttonsAction$
      .pipe(
        filter(
          (buttonAction) =>
            buttonAction === PageContentEntityToolbarButtons.Delete,
        ),
      )
      .subscribe(this.deleteActionHandler.bind(this));
    this.subscriptions.add(entityRepoSubscription);
  }

  private deleteActionHandler() {
    this.loading = true;
    this.dataDeleteSource
      .mutate({ id: this.entityId })
      .pipe(take(1))
      .subscribe(this.postDeleteRedirect.bind(this));
  }

  private async postDeleteRedirect() {
    this.actions.dispatch(
      appDisplaySuccessMessage({
        message: `${this.entityLabel} deleted`,
      }),
    );
    await this.redirectWithRefetch(this.backButtonRoute);
  }
}
