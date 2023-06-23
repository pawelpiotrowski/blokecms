import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteStyleGQL, GetStyleGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { StyleComponent } from './style.component';
import { StyleModel } from './style.model';

describe('StyleComponent', () => {
  let component: StyleComponent;
  let fixture: ComponentFixture<StyleComponent>;
  let router: Router;
  const getStyleSource$ = new Subject();
  const mockGetStyleSource = {
    fetch: jest.fn().mockReturnValue(getStyleSource$.asObservable()),
  };
  const deleteStyleSource$ = new Subject();
  const mockDeleteStyleSource = {
    mutate: jest.fn().mockReturnValue(deleteStyleSource$.asObservable()),
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
      declarations: [StyleComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: StyleComponent,
            data: {
              title: 'Create Style',
            },
          },
          {
            path: ':id',
            component: StyleComponent,
            data: {
              title: 'View Style',
            },
          },
          {
            path: ':id/edit',
            component: StyleComponent,
            data: {
              title: 'Edit Style',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetStyleGQL, useValue: mockGetStyleSource },
        { provide: DeleteStyleGQL, useValue: mockDeleteStyleSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  describe('styleData', () => {
    it('should be set to style model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const styleModel = new StyleModel();

      expect(component.styleData).toEqual(styleModel);
    });

    it('should be set to style data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          style: {
            _id: '123',
          },
        },
      };

      getStyleSource$.next(mockDataSourceUpdate);
      expect(component.styleData).toEqual(mockDataSourceUpdate.data.style);
    });
  });
});
