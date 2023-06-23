import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteBlockCodeGQL, GetBlockCodeGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { CodeComponent } from './code.component';
import { BlockCodeModel } from './code.model';

describe('CodeComponent', () => {
  let component: CodeComponent;
  let fixture: ComponentFixture<CodeComponent>;
  let router: Router;
  const getBlockCodeSource$ = new Subject();
  const mockGetBlockCodeSource = {
    fetch: jest.fn().mockReturnValue(getBlockCodeSource$.asObservable()),
  };
  const deleteBlockCodeSource$ = new Subject();
  const mockDeleteBlockCodeSource = {
    mutate: jest.fn().mockReturnValue(deleteBlockCodeSource$.asObservable()),
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
      declarations: [CodeComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: CodeComponent,
            data: {
              title: 'Create Code Block',
            },
          },
          {
            path: ':id',
            component: CodeComponent,
            data: {
              title: 'ViewCode  Block',
            },
          },
          {
            path: ':id/edit',
            component: CodeComponent,
            data: {
              title: 'Edit Code Block',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetBlockCodeGQL, useValue: mockGetBlockCodeSource },
        { provide: DeleteBlockCodeGQL, useValue: mockDeleteBlockCodeSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('codeData', () => {
    it('should be set to code model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const codeModel = new BlockCodeModel();

      expect(component.codeData).toEqual(codeModel);
    });

    it('should be set to code data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blockCode: {
            _id: '123',
          },
        },
      };

      getBlockCodeSource$.next(mockDataSourceUpdate);
      expect(component.codeData).toEqual(mockDataSourceUpdate.data.blockCode);
    });
  });
});
