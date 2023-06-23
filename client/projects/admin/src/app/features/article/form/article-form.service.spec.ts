import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreateArticleGQL,
  GetArticleGQL,
  GetArticlesGQL,
  LoggerService,
  UpdateArticleGQL,
} from 'shared-lib';
import { ArticleFormService } from './article-form.service';

describe('ArticleFormService', () => {
  let service: ArticleFormService;
  let router: Router;
  let updateArticle: UpdateArticleGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createArticleSource$ = new Subject();
  const mockCreateArticleSource = {
    mutate: jest.fn().mockReturnValue(createArticleSource$.asObservable()),
  };
  const updateArticleSource$ = new Subject();
  const mockUpdateArticleSource = {
    mutate: jest.fn().mockReturnValue(updateArticleSource$.asObservable()),
  };
  const mockGetArticles = { document: {} };
  const getArticleSource$ = new Subject();
  const mockGetArticleSource = {
    fetch: jest.fn().mockReturnValue(getArticleSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateArticleGQL, useValue: mockCreateArticleSource },
        { provide: UpdateArticleGQL, useValue: mockUpdateArticleSource },
        { provide: GetArticleGQL, useValue: mockGetArticleSource },
        { provide: GetArticlesGQL, useValue: mockGetArticles },
        ArticleFormService,
      ],
    });
    service = TestBed.inject(ArticleFormService);
    router = TestBed.inject(Router);
    updateArticle = TestBed.inject(UpdateArticleGQL);
  });

  describe('createHandler', () => {
    const mockArticleCreateInput = {
      title: 'Foo',
      content: [],
    };
    const mockCreatedArticle = {
      createArticle: {
        _id: '123',
        ...mockArticleCreateInput,
      },
    };

    it('should call create article mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockArticleCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockArticleCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedArticle })).toEqual(
        mockCreatedArticle.createArticle,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockArticleUpdateInput = {
      _id: '123',
      title: 'Foo',
      content: [],
    };
    const mockUpdatedArticle = {
      updateArticle: {
        ...mockArticleUpdateInput,
      },
    };

    it('should call update article mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockArticleUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockArticleUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedArticle })).toEqual(
        mockUpdatedArticle.updateArticle,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('getUpdateHandler', () => {
    const mockArticleUpdateInput = {
      title: 'Hello',
      _id: '444',
    };
    const mockUpdatedArticle = {
      updateArticle: {
        ...mockArticleUpdateInput,
      },
    };

    it('should get update article mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (updateArticle.mutate as jest.Mock).mockClear();
      service.getUpdateHandler(mockArticleUpdateInput).subscribe();
      updateArticleSource$.next({ loading: false, data: mockUpdatedArticle });
      tick();
      expect(updateArticle.mutate).toHaveBeenCalled();
    }));
  });

  describe('cleanQueryParams', () => {
    it('should refresh current url to remove query params', async () => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      await service.cleanQueryParams('456');

      expect(router.navigate).toHaveBeenLastCalledWith(
        ['/articles', '456', 'edit'],
        { replaceUrl: true },
      );
    });

    it('should reset query params with current url when passed as argument', async () => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      await service.cleanQueryParams('456', { foo: 'bar' });

      expect(router.navigate).toHaveBeenLastCalledWith(
        ['/articles', '456', 'edit'],
        { replaceUrl: true, queryParams: { foo: 'bar' } },
      );
    });
  });
});
