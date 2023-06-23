import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ArticleContent } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { ArticleFormComponent } from './article-form.component';
import { ArticleFormService } from './article-form.service';

describe('ArticleFormComponent', () => {
  let component: ArticleFormComponent;
  let fixture: ComponentFixture<ArticleFormComponent>;
  let articleFormService: ArticleFormService;
  let entityRepo: PageEntityContentRepository;

  const mockArticleFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    createHandler: jest.fn(),
    updateHandler: jest.fn(),
    getUpdateHandler: jest.fn(),
    getLastSave: jest.fn().mockReturnValue(of(null)),
    cleanQueryParams: jest.fn(),
  };

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockArticleNew = {
    _id: '',
    title: '',
    content: [],
  };
  const mockArticleEdit = {
    _id: '123',
    title: 'Foo',
    content: [{ refId: '456', kind: 'text' } as ArticleContent],
  };
  const mockActivatedRouteQueryParams$ = new Subject();
  const mockActivatedRoute = {
    queryParams: mockActivatedRouteQueryParams$.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ArticleFormService, useValue: mockArticleFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
      .overrideComponent(ArticleFormComponent, {
        set: {
          providers: [
            { provide: ArticleFormService, useValue: mockArticleFormService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleFormComponent);
    articleFormService = TestBed.inject(ArticleFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    buttonsAction$.next(null);
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons', () => {
      component.article = mockArticleNew;
      fixture.detectChanges();
      expect(articleFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        false,
      );
      expect(articleFormService.toggleResetButton).toHaveBeenLastCalledWith(
        false,
      );
    });

    it('should set isEdit to true if article has _id', () => {
      component.article = mockArticleEdit;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });

    it('should set isEdit to false if blockText has NO _id', () => {
      component.article = mockArticleNew;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(false);
    });

    it('should subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      component.article = mockArticleEdit;
      fixture.detectChanges();
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should set article form', () => {
      component.article = mockArticleNew;
      fixture.detectChanges();
      expect(component.articleForm).toBeInstanceOf(FormGroup);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      component.article = mockArticleNew;
      fixture.detectChanges();
      // when subscribed currently both actions are resulting with buttons being disabled
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(articleFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        false,
      );
      (articleFormService.toggleSaveButton as jest.Mock).mockClear();

      component.ngOnDestroy();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(articleFormService.toggleSaveButton).not.toHaveBeenCalled();
    });
  });

  describe('articleFormSubmit', () => {
    it('should prevent default on passed event and return early if article can not be submitted', () => {
      (articleFormService.updateHandler as jest.Mock).mockClear();
      (articleFormService.createHandler as jest.Mock).mockClear();
      component.article = mockArticleNew;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      component.articleFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(articleFormService.updateHandler).not.toHaveBeenCalled();
      expect(articleFormService.createHandler).not.toHaveBeenCalled();
    });

    it('should prevent default on passed event and call save action if article can be submitted', () => {
      (articleFormService.updateHandler as jest.Mock).mockClear();
      (articleFormService.createHandler as jest.Mock).mockClear();
      component.article = mockArticleEdit;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      component.articleFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(articleFormService.updateHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentUpdate', () => {
    it('should update article content and enable save and reset buttons', () => {
      component.article = mockArticleEdit;
      fixture.detectChanges();

      component.onContentUpdate([]);
      expect(component.article).toEqual({
        ...component.article,
        content: [],
      });
      expect(articleFormService.toggleResetButton).toHaveBeenLastCalledWith(
        true,
      );
      expect(articleFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        true,
      );
    });
  });

  describe('onSearchResult', () => {
    it('should return early if event is empty array otherwise prepend event items to article content', () => {
      component.article = mockArticleEdit;
      fixture.detectChanges();

      jest.spyOn(component, 'onContentUpdate');

      component.onSearchResult([]);
      expect(component.onContentUpdate).not.toHaveBeenCalled();
      expect((component.article.content as ArticleContent[])[0]).toEqual(
        mockArticleEdit.content[0],
      );
      expect(component.article.content?.length).toEqual(1);

      const mockNewContentItem: ArticleContent = {
        refId: '654456',
        kind: 'media',
      };
      component.onSearchResult([mockNewContentItem]);

      expect(component.onContentUpdate).toHaveBeenCalledWith([
        mockNewContentItem,
        mockArticleEdit.content[0],
      ]);
      expect((component.article.content as ArticleContent[])[0]).toEqual(
        mockNewContentItem,
      );
      expect(component.article.content?.length).toEqual(2);
    });
  });

  describe('resetAction', () => {
    it('should get last saved version of article and disable save and reset buttons', () => {
      component.article = { ...mockArticleEdit };
      component.article.title = 'Test ' + component.article.title;
      (articleFormService.getLastSave as jest.Mock).mockReturnValueOnce(
        of({
          data: {
            article: mockArticleEdit,
          },
        }),
      );
      fixture.detectChanges();

      expect(component.article.title).toEqual('Test Foo');

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);

      expect(component.article.title).toEqual('Foo');
      expect(articleFormService.toggleResetButton).toHaveBeenLastCalledWith(
        false,
      );
      expect(articleFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        false,
      );
    });
  });

  describe('articleContent', () => {
    it('should return empty array if article is not defined otherwise article content', () => {
      component.article = { _id: '123', title: 'Bar' };
      fixture.detectChanges();

      expect(component.articleContent).toEqual([]);

      component.article = mockArticleEdit;
      fixture.detectChanges();

      expect(component.articleContent).toEqual(mockArticleEdit.content);
    });
  });

  describe('articleFormValueChangeHandler', () => {
    it('should enable reset and save buttons on change', () => {
      component.article = mockArticleEdit;
      fixture.detectChanges();

      component.articleForm.markAsDirty();
      component.articleForm.setValue({
        title: 'Hello',
      });

      expect(articleFormService.toggleResetButton).toHaveBeenLastCalledWith(
        true,
      );
      expect(articleFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        true,
      );
    });
  });

  describe('queryParamsHandler', () => {
    beforeEach(() => {
      (articleFormService.cleanQueryParams as jest.Mock).mockClear();
      (articleFormService.getUpdateHandler as jest.Mock).mockClear();
      component.article = mockArticleEdit;
      fixture.detectChanges();
    });

    it('should return early if params are empty', () => {
      mockActivatedRouteQueryParams$.next({});
      expect(articleFormService.cleanQueryParams).not.toHaveBeenCalled();
      expect(articleFormService.getUpdateHandler).not.toHaveBeenCalled();
    });

    it('should set pageId if parent params are set to "pages"', () => {
      mockActivatedRouteQueryParams$.next({
        parent: 'pages',
        id: '1234567',
      });
      expect(articleFormService.cleanQueryParams).not.toHaveBeenCalled();
      expect(articleFormService.getUpdateHandler).not.toHaveBeenCalled();
      expect(component.pageId).toEqual('1234567');
    });

    it('should clean query and return early if params "new" property is empty', () => {
      mockActivatedRouteQueryParams$.next({
        foo: 'bar',
      });
      expect(articleFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockArticleEdit._id,
      );
      expect(articleFormService.getUpdateHandler).not.toHaveBeenCalled();
    });

    it('should reset query to parent "pages" and return early if params "new" property is empty but "pageId" present', () => {
      mockActivatedRouteQueryParams$.next({
        foo: 'bar',
        pageId: '223344',
      });
      expect(articleFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockArticleEdit._id,
        {
          parent: 'pages',
          id: '223344',
        },
      );
      expect(articleFormService.getUpdateHandler).not.toHaveBeenCalled();
    });

    it('should add new content item and clean query if params "new" property is NOT empty', () => {
      (articleFormService.cleanQueryParams as jest.Mock).mockResolvedValueOnce(
        true,
      );
      (articleFormService.getUpdateHandler as jest.Mock).mockReturnValue(
        of({}),
      );
      mockActivatedRouteQueryParams$.next({
        new: true,
        id: '666',
        kind: 'media',
      });
      expect(articleFormService.getUpdateHandler).toHaveBeenLastCalledWith({
        _id: mockArticleEdit._id,
        title: mockArticleEdit.title,
        content: [{ refId: '666', kind: 'Media' }, ...mockArticleEdit.content],
      });

      expect(articleFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockArticleEdit._id,
      );
    });

    it('should add new content item and reset query to parent "pages" if params "new" property is NOT empty and "pageId" present', () => {
      (articleFormService.cleanQueryParams as jest.Mock).mockResolvedValueOnce(
        true,
      );
      (articleFormService.getUpdateHandler as jest.Mock).mockReturnValue(
        of({}),
      );
      mockActivatedRouteQueryParams$.next({
        new: true,
        id: '666',
        kind: 'media',
        pageId: '999',
      });
      expect(articleFormService.getUpdateHandler).toHaveBeenLastCalledWith({
        _id: mockArticleEdit._id,
        title: mockArticleEdit.title,
        content: [{ refId: '666', kind: 'Media' }, ...mockArticleEdit.content],
      });

      expect(articleFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockArticleEdit._id,
        {
          parent: 'pages',
          id: '999',
        },
      );
    });
  });
});
