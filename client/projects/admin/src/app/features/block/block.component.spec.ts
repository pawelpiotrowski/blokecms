import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteBlockTextGQL, GetBlockTextGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { BlockComponent } from './block.component';
import { BlockTextModel } from './block.model';

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;
  let router: Router;
  const getBlockTextSource$ = new Subject();
  const mockGetBlockTextSource = {
    fetch: jest.fn().mockReturnValue(getBlockTextSource$.asObservable()),
  };
  const deleteBlockTextSource$ = new Subject();
  const mockDeleteBlockTextSource = {
    mutate: jest.fn().mockReturnValue(deleteBlockTextSource$.asObservable()),
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
      declarations: [BlockComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: BlockComponent,
            data: {
              title: 'Create Block',
            },
          },
          {
            path: ':id',
            component: BlockComponent,
            data: {
              title: 'View Block',
            },
          },
          {
            path: ':id/edit',
            component: BlockComponent,
            data: {
              title: 'Edit Block',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetBlockTextGQL, useValue: mockGetBlockTextSource },
        { provide: DeleteBlockTextGQL, useValue: mockDeleteBlockTextSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('blockTextData', () => {
    it('should be set to blockText model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const blockTextModel = new BlockTextModel();

      expect(component.blockTextData).toEqual(blockTextModel);
    });

    it('should be set to blockText data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blockText: {
            _id: '123',
          },
        },
      };

      getBlockTextSource$.next(mockDataSourceUpdate);
      expect(component.blockTextData).toEqual(
        mockDataSourceUpdate.data.blockText,
      );
    });
  });
});
