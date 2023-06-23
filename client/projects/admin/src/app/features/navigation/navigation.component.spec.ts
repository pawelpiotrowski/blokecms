import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteNavigationGQL, GetNavigationGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { NavigationComponent } from './navigation.component';
import { NavigationModel } from './navigation.model';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;
  const getNavigationSource$ = new Subject();
  const mockGetNavigationSource = {
    fetch: jest.fn().mockReturnValue(getNavigationSource$.asObservable()),
  };
  const deleteNavigationSource$ = new Subject();
  const mockDeleteNavigationSource = {
    mutate: jest.fn().mockReturnValue(deleteNavigationSource$.asObservable()),
  };
  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  let mockActivatedRoute: PageWithChildDrawerActivatedRouteMock;

  beforeEach(async () => {
    mockActivatedRoute = getPageWithChildDrawerActivatedRouteMockClone();
    await TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: NavigationComponent,
            data: {
              title: 'Create Navigation',
            },
          },
          {
            path: ':id',
            component: NavigationComponent,
            data: {
              title: 'View Navigation',
            },
          },
          {
            path: ':id/edit',
            component: NavigationComponent,
            data: {
              title: 'Edit Navigation',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetNavigationGQL, useValue: mockGetNavigationSource },
        { provide: DeleteNavigationGQL, useValue: mockDeleteNavigationSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('navigationData', () => {
    it('should be set to navigation model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const navigationModel = new NavigationModel();

      expect(component.navigationData).toEqual(navigationModel);
    });

    it('should be set to navigation data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          navigation: {
            _id: '123',
          },
        },
      };

      getNavigationSource$.next(mockDataSourceUpdate);
      expect(component.navigationData).toEqual(
        mockDataSourceUpdate.data.navigation,
      );
    });
  });
});
