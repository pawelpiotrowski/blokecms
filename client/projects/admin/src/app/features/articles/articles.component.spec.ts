import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import { DeleteArticleGQL, GetArticlesGQL, LoggerService } from 'shared-lib';
import { ArticlesComponent } from './articles.component';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteArticleGql: DeleteArticleGQL;
  let actions: Actions;
  const articlesSource$ = new Subject();
  const mockArticlesSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockArticlesSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: articlesSource$.asObservable(),
      refetch: mockArticlesSourceRefetch,
    }),
  };
  const deleteArticleSource$ = new Subject();
  const mockDeleteArticleSource = {
    mutate: jest.fn().mockReturnValue(deleteArticleSource$.asObservable()),
  };
  const mockLoggerService = {
    error: jest.fn(),
    warn: jest.fn(),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetArticlesGQL, useValue: mockArticlesSource },
        { provide: DeleteArticleGQL, useValue: mockDeleteArticleSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteArticleGql = TestBed.inject(DeleteArticleGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      // id column
      expect(component.columns[0].columnDef).toEqual('title');
      expect(component.columns[0].header).toEqual('Title');
      expect(component.columns[0].cell({ title: 'Article Title' })).toEqual(
        'Article Title',
      );
    });
  });

  describe('data', () => {
    it('should be set to articles source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          articles: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      articlesSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.articles);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsArticle = { _id: '1' };

    it('should redirect to article edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsArticle);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
      ]);
      expect(deleteArticleGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsArticle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Article action foo not supported`,
        ArticlesComponent.name,
      );
    });

    it('should redirect to article view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsArticle);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
      ]);
      expect(deleteArticleGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsArticle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Article action foo not supported`,
        ArticlesComponent.name,
      );
    });

    it('should call mutation delete article gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsArticle);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/articles',
        mockRowAsArticle._id,
      ]);
      expect(deleteArticleGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsArticle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Article action foo not supported`,
        ArticlesComponent.name,
      );
    });

    it('should refetch articles after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsArticle);

      expect(component.loading).toEqual(true);
      deleteArticleSource$.next({ _id: '2' });
      tick();
      expect(mockArticlesSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
