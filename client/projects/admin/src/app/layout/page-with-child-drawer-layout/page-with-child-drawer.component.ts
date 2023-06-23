import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import { Mutation, Query, QueryRef } from 'apollo-angular';
import { filter, take, Subscription } from 'rxjs';
import { LoggerService } from 'shared-lib';
import { appDisplaySuccessMessage } from '../../app.actions';

@Component({ template: '' })
export abstract class PageWithChildDrawerComponent<T>
  implements OnInit, OnDestroy
{
  loading!: boolean;
  hasChildView!: boolean;
  entityLabel!: string;
  protected dataSource!: Query<T>;
  protected dataSourceUpdateFunction!: (data: T) => void;
  protected dataSourceWatch!: QueryRef<T>;
  protected dataSourceDeleteItem!: Mutation;
  protected dataSourceDeleteItemCallback!: () => void;
  private dataSubscription!: Subscription;
  private routerEventsSubscription!: Subscription;

  constructor(
    private router: Router,
    private actions: Actions,
    private logger: LoggerService,
  ) {}

  ngOnInit() {
    this.routerEventsSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(this.routeChangeHandler.bind(this));
    this.checkActiveRouteForChildren();

    if (!this.hasChildView) {
      this.setDataSubscription();
    }
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  protected deleteDataItem(id: string) {
    this.loading = true;
    this.dataSourceDeleteItem
      .mutate({ id })
      .pipe(take(1))
      .subscribe(this.postDeleteHandler.bind(this));
  }

  private async postDeleteHandler() {
    this.actions.dispatch(
      appDisplaySuccessMessage({
        message: `${this.entityLabel} deleted`,
      }),
    );
    await this.refetchDataSource();
  }

  protected async redirect(params: string[]) {
    try {
      await this.router.navigate(params);
    } catch (e) {
      this.logger.error(
        `Error redirecting to params: ${params}`,
        PageWithChildDrawerComponent.name,
        e,
      );
    }
  }

  protected async refetchDataSource() {
    try {
      await this.dataSourceWatch.refetch();
    } catch (e) {
      this.logger.error(
        `Error refetching data`,
        PageWithChildDrawerComponent.name,
        e,
      );
    }
  }

  private async routeChangeHandler() {
    this.checkActiveRouteForChildren();
    if (this.shouldRefetch()) {
      await this.refetchDataSource();
      return;
    }
    this.setDataSubscription();
  }

  private checkActiveRouteForChildren() {
    let route: ActivatedRoute = this.router.routerState.root;

    while (route!.firstChild) {
      route = route.firstChild;
    }

    this.hasChildView = route.snapshot.parent?.component != null;
  }

  private setDataSubscription() {
    if (this.dataSubscription !== undefined) {
      return;
    }
    this.dataSourceWatch = this.dataSource.watch();
    this.dataSubscription = this.dataSourceWatch.valueChanges.subscribe(
      ({ data, loading }) => {
        if (!loading) {
          this.dataSourceUpdateFunction(data);
        }
        this.loading = loading;
      },
    );
  }

  private shouldRefetch() {
    const navigation = this.router.getCurrentNavigation();

    if (
      navigation == null ||
      !navigation.extras ||
      !navigation.extras.state ||
      !navigation.extras.state['refetch']
    ) {
      return false;
    }
    return navigation.extras.state['refetch'] === true;
  }
}
