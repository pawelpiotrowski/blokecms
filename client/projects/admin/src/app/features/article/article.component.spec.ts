import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeleteArticleGQL, GetArticleGQL } from 'shared-lib';
import {
  PageWithChildDrawerActivatedRouteMock,
  getPageWithChildDrawerActivatedRouteMockClone,
} from '../../../../test/activated-route.mock';
import { PageContentEntityToolbarButtonAction } from '../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../layout/page-content-entity-layout/page-entity-content.repository';
import { ArticleComponent } from './article.component';
import { ArticleModel } from './article.model';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let router: Router;
  const getArticleSource$ = new Subject();
  const mockGetArticleSource = {
    fetch: jest.fn().mockReturnValue(getArticleSource$.asObservable()),
  };
  const deleteArticleSource$ = new Subject();
  const mockDeleteArticleSource = {
    mutate: jest.fn().mockReturnValue(deleteArticleSource$.asObservable()),
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
      declarations: [ArticleComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'new',
            component: ArticleComponent,
            data: {
              title: 'Create Article',
            },
          },
          {
            path: ':id',
            component: ArticleComponent,
            data: {
              title: 'View Article',
            },
          },
          {
            path: ':id/edit',
            component: ArticleComponent,
            data: {
              title: 'Edit Article',
            },
          },
        ]),
      ],
      providers: [
        { provide: GetArticleGQL, useValue: mockGetArticleSource },
        { provide: DeleteArticleGQL, useValue: mockDeleteArticleSource },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  describe('articleData', () => {
    it('should be set to article model when view type is "new"', async () => {
      mockActivatedRoute.snapshot.params = {} as any;

      await router.navigate(['/new']);

      fixture.detectChanges();
      const articleModel = new ArticleModel();

      expect(component.articleData).toEqual(articleModel);
    });

    it('should be set to article data when view type is NOT "new"', async () => {
      await router.navigate(['/123', 'edit']);

      fixture.detectChanges();
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          article: {
            _id: '123',
          },
        },
      };

      getArticleSource$.next(mockDataSourceUpdate);
      expect(component.articleData).toEqual(mockDataSourceUpdate.data.article);
    });
  });
});
