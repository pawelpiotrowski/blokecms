import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteBlockMediaGQL, GetBlockMediaGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { MediaComponent } from './media.component';
import { BlockMediaModel } from './media.model';

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;
  let router: Router;
  const getBlockMediaSource$ = new Subject();
  const mockGetBlockMediaSource = {
    fetch: jest.fn().mockReturnValue(getBlockMediaSource$.asObservable()),
  };
  const deleteBlockMediaSource$ = new Subject();
  const mockDeleteBlockMediaSource = {
    mutate: jest.fn().mockReturnValue(deleteBlockMediaSource$.asObservable()),
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
      declarations: [MediaComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: MediaComponent,
            data: {
              title: 'Create Mutimedia',
            },
          },
          {
            path: ':id',
            component: MediaComponent,
            data: {
              title: 'View Mutimedia',
            },
          },
          {
            path: ':id/edit',
            component: MediaComponent,
            data: {
              title: 'Edit Mutimedia',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetBlockMediaGQL, useValue: mockGetBlockMediaSource },
        { provide: DeleteBlockMediaGQL, useValue: mockDeleteBlockMediaSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('blockMediaData', () => {
    it('should be set to blockMedia model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const blockMediaModel = new BlockMediaModel();

      expect(component.blockMediaData).toEqual(blockMediaModel);
    });

    it('should be set to blockMedia data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blockMedia: {
            _id: '123',
          },
        },
      };

      getBlockMediaSource$.next(mockDataSourceUpdate);
      expect(component.blockMediaData).toEqual(
        mockDataSourceUpdate.data.blockMedia,
      );
    });
  });
});
