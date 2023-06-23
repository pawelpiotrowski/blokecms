import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { appDisplaySuccessMessage } from '../../app.actions';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../page-content-entity-layout/page-entity-content.repository';
import { PageWithChildDrawerChildComponent } from './page-with-child-drawer-child.component';

const dataSource$ = new Subject();
const mockDataSource = {
  fetch: jest.fn().mockReturnValue(dataSource$.asObservable()),
};
const deleteSource$ = new Subject();
const mockDeleteSource = {
  mutate: jest.fn().mockReturnValue(deleteSource$.asObservable()),
};
const buttonsAction$ =
  new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
const mockEntityRepository = {
  buttonsAction$,
};
const mockDataModel = {
  foo: 'bar',
  bar: 'foo',
};
const mockActions = {
  dispatch: jest.fn(),
};

@Component({
  selector: 'admin-test-page-with-drawer-child',
  template: '<div></div>',
})
export class TestPageWithDrawerChildComponent extends PageWithChildDrawerChildComponent<
  any,
  any
> {
  constructor(
    entityRepo: PageEntityContentRepository,
    route: ActivatedRoute,
    router: Router,
    actions: Actions,
  ) {
    super(entityRepo, route, router, actions);
    this.dataSource = mockDataSource as any;
    this.dataModel = mockDataModel;
    this.dataSourceUpdateFunction = this.testDataUpdateCallback;
    this.dataDeleteSource = mockDeleteSource as any;
    this.entityLabel = 'TestPageWithDrawerChildComponent';
  }

  testDataUpdateCallback = jest.fn();

  async testredirectWithRefetch(url: string) {
    await this.redirectWithRefetch(url);
  }
}

@Component({
  template: 'Parent',
})
export class ParentComponent {}

let mockActivatedRoute: PageWithChildDrawerActivatedRouteMock;

describe('PageWithChildDrawerChildComponent', () => {
  let component: TestPageWithDrawerChildComponent;
  let fixture: ComponentFixture<TestPageWithDrawerChildComponent>;
  let router: Router;
  let actions: Actions;

  beforeEach(async () => {
    mockActivatedRoute = getPageWithChildDrawerActivatedRouteMockClone();
    await TestBed.configureTestingModule({
      declarations: [TestPageWithDrawerChildComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'test',
            component: ParentComponent,
            data: {
              title: 'Hello',
            },
            children: [
              {
                path: 'new',
                component: TestPageWithDrawerChildComponent,
                data: {
                  title: 'Create',
                },
              },
              {
                path: ':id',
                component: TestPageWithDrawerChildComponent,
                data: {
                  title: 'View',
                },
              },
              {
                path: ':id/edit',
                component: TestPageWithDrawerChildComponent,
                data: {
                  title: 'Edit',
                },
              },
            ],
          },
          {
            path: 'test-noop',
            component: ParentComponent,
          },
        ]),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    actions = TestBed.inject(Actions);
    fixture = TestBed.createComponent(TestPageWithDrawerChildComponent);
    component = fixture.componentInstance;
  });

  describe('backButtonLabel', () => {
    it('should be set to parent route data title', async () => {
      await router.navigate(['/test', 'new']);
      fixture.detectChanges();
      expect(component.backButtonLabel).toEqual(
        mockActivatedRoute.snapshot.parent.data.title,
      );
    });

    it('should be set to empty string if parent route data title is missing', async () => {
      mockActivatedRoute.snapshot.parent = {} as any;
      await router.navigate(['/test-noop']);
      fixture.detectChanges();
      expect(component.backButtonLabel).toEqual('');
    });
  });

  describe('backButtonRoute', () => {
    describe('when parent route config is available', () => {
      it('should should be set to parent route config path', async () => {
        await router.navigate(['/test', 'new']);
        fixture.detectChanges();
        expect(component.backButtonRoute).toEqual(
          mockActivatedRoute.snapshot.parent.parent.routeConfig.path,
        );
      });

      it('should be set to empty string if parent route is missing', async () => {
        mockActivatedRoute.snapshot.parent = {} as any;
        await router.navigate(['/test-noop']);
        fixture.detectChanges();
        expect(component.backButtonRoute).toEqual('');
      });
    });

    describe('when parent route config is NOT available', () => {
      it('should should be set to parent route config path', async () => {
        mockActivatedRoute.snapshot.parent.parent.routeConfig = {} as any;
        await router.navigate(['/test-noop']);
        fixture.detectChanges();
        expect(component.backButtonRoute).toEqual('');
      });
    });
  });

  describe('entityId', () => {
    it('should be set to route params id', async () => {
      await router.navigate(['/test', 'new']);
      fixture.detectChanges();
      expect(component.entityId).toEqual(mockActivatedRoute.snapshot.params.id);
    });
  });

  describe('setViewType', () => {
    it('should set isNew to false when entityId is NOT nullish', async () => {
      await router.navigate(['/test', '123', 'edit']);
      fixture.detectChanges();
      expect(component.isNew).toEqual(false);
    });

    it('should set isNew to true when entityId is nullish', async () => {
      mockActivatedRoute.snapshot.params = {} as any;
      await router.navigate(['/test', 'new']);
      fixture.detectChanges();
      expect(component.isNew).toEqual(true);
    });

    it('should set isEdit to false when there is less than 2 url segments', async () => {
      await router.navigate(['/test', 'new']);
      fixture.detectChanges();
      expect(component.isEdit).toEqual(false);
    });

    it('should set isEdit to true when there is more than 1 url segment', async () => {
      mockActivatedRoute.snapshot.url = [{}, {}] as any;
      await router.navigate(['/test', '123', 'edit']);
      fixture.detectChanges();
      expect(component.isEdit).toEqual(true);
    });

    it('should set isView to true when isEdit and isNew is set to false', async () => {
      await router.navigate(['/test', '123']);
      fixture.detectChanges();
      expect(component.isView).toEqual(true);
    });

    it('should set isView to false when either isEdit or isNew is set to true', async () => {
      mockActivatedRoute.snapshot.params = {} as any;
      await router.navigate(['/test', 'new']);
      fixture.detectChanges();
      expect(component.isView).toEqual(false);
    });
  });

  describe('dataSubscription', () => {
    it('should call data source update function directly when view type is "new" passing a model', async () => {
      component.testDataUpdateCallback.mockClear();
      mockDataSource.fetch.mockClear();
      mockActivatedRoute.snapshot.params = {} as any;
      await router.navigate(['/test', '123']);
      fixture.detectChanges();
      expect(component.isNew).toEqual(true);
      expect(component.testDataUpdateCallback).toHaveBeenLastCalledWith(
        mockDataModel,
      );
      expect(mockDataSource.fetch).not.toHaveBeenCalled();
    });

    it('should call data source update function passing subscription data when NOT loading and view type is NOT "new"', async () => {
      const mockEntityId = '24fkzrw3487943uf358lovd';
      component.testDataUpdateCallback.mockClear();
      mockDataSource.fetch.mockClear();
      mockActivatedRoute.snapshot.params = {
        id: mockEntityId,
      } as any;
      await router.navigate(['/test', mockEntityId]);
      dataSource$.next({ loading: true });
      fixture.detectChanges();
      expect(component.isNew).toEqual(false);
      expect(component.testDataUpdateCallback).not.toHaveBeenLastCalledWith(
        mockDataModel,
      );
      expect(mockDataSource.fetch).toHaveBeenLastCalledWith(
        { input: { _id: mockEntityId } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      );
      expect(component.testDataUpdateCallback).not.toHaveBeenCalled();
      dataSource$.next({ loading: false, data: { hello: 'world' } });
      expect(component.testDataUpdateCallback).toHaveBeenCalledWith({
        hello: 'world',
      });
    });
  });

  describe('redirectWithRefetch', () => {
    it('should call router navigate by url method with state object', async () => {
      jest.spyOn(router, 'navigateByUrl');
      fixture.detectChanges();
      await component.testredirectWithRefetch('test');
      expect(router.navigateByUrl).toHaveBeenLastCalledWith('test', {
        state: { refetch: true },
      });
    });
  });

  describe('entityRepoSubscription', () => {
    it('should set entity repo buttons delete action subscription', () => {
      jest.spyOn(router, 'navigateByUrl').mockResolvedValueOnce(true);
      (mockDeleteSource.mutate as jest.Mock).mockClear();
      fixture.detectChanges();
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      buttonsAction$.next(PageContentEntityToolbarButtons.Delete);
      deleteSource$.next({});
      expect(mockDeleteSource.mutate).toHaveBeenLastCalledWith({
        id: component.entityId,
      });
      expect(router.navigateByUrl).toHaveBeenLastCalledWith(
        component.backButtonRoute,
        { state: { refetch: true } },
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
      (mockDeleteSource.mutate as jest.Mock).mockClear();
      component.ngOnDestroy();
      buttonsAction$.next(PageContentEntityToolbarButtons.Delete);
      expect(mockDeleteSource.mutate).not.toHaveBeenCalled();
    });
  });
});
