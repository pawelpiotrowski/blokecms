import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeletePageGQL, GetPageGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageComponent } from './page.component';
import { PageModel } from './page.model';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let router: Router;
  const getPageSource$ = new Subject();
  const mockGetPageSource = {
    fetch: jest.fn().mockReturnValue(getPageSource$.asObservable()),
  };
  const deletePageSource$ = new Subject();
  const mockDeletePageSource = {
    mutate: jest.fn().mockReturnValue(deletePageSource$.asObservable()),
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
      declarations: [PageComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: PageComponent,
            data: {
              title: 'Create Page',
            },
          },
          {
            path: ':id',
            component: PageComponent,
            data: {
              title: 'View Page',
            },
          },
          {
            path: ':id/edit',
            component: PageComponent,
            data: {
              title: 'Edit Page',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetPageGQL, useValue: mockGetPageSource },
        { provide: DeletePageGQL, useValue: mockDeletePageSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('pageData', () => {
    it('should be set to page model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const pageModel = new PageModel();

      expect(component.pageData).toEqual(pageModel);
    });

    it('should be set to page data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          page: {
            _id: '123',
          },
        },
      };

      getPageSource$.next(mockDataSourceUpdate);
      expect(component.pageData).toEqual(mockDataSourceUpdate.data.page);
    });
  });
});
