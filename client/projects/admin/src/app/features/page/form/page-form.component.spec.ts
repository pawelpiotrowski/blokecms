import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Article } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageFormComponent } from './page-form.component';
import { PageFormService } from './page-form.service';

describe('PageFormComponent', () => {
  let component: PageFormComponent;
  let fixture: ComponentFixture<PageFormComponent>;
  let pageFormService: PageFormService;
  let entityRepo: PageEntityContentRepository;

  const mockPageFormService = {
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
  const mockPageNew = {
    _id: '',
    slug: '',
    title: '',
    articles: [],
  };
  const mockPageEdit = {
    _id: '123',
    slug: 'foo_foo',
    title: 'Foo',
    articles: [{ _id: '987', title: 'Home Page', slug: 'slug' }],
  };
  const mockActivatedRouteQueryParams$ = new Subject();
  const mockActivatedRoute = {
    queryParams: mockActivatedRouteQueryParams$.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PageFormService, useValue: mockPageFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
      .overrideComponent(PageFormComponent, {
        set: {
          providers: [
            { provide: PageFormService, useValue: mockPageFormService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PageFormComponent);
    pageFormService = TestBed.inject(PageFormService);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    buttonsAction$.next(null);
  });

  describe('ngOnInit', () => {
    it('should disable save and reset buttons', () => {
      component.entity = mockPageNew;
      fixture.detectChanges();
      expect(pageFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      expect(pageFormService.toggleResetButton).toHaveBeenLastCalledWith(false);
    });

    it('should set isEdit to true if page has _id', () => {
      component.entity = mockPageEdit;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });

    it('should set isEdit to false if blockText has NO _id', () => {
      component.entity = mockPageNew;
      fixture.detectChanges();

      expect(component.isEdit).toEqual(false);
    });

    it('should subscribe to entity button actions', () => {
      jest.spyOn(entityRepo.buttonsAction$, 'subscribe');
      component.entity = mockPageEdit;
      fixture.detectChanges();
      expect(entityRepo.buttonsAction$.subscribe).toHaveBeenCalledTimes(1);
    });

    it('should set page form', () => {
      component.entity = mockPageNew;
      fixture.detectChanges();
      expect(component.entityForm).toBeInstanceOf(FormGroup);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      component.entity = mockPageNew;
      fixture.detectChanges();
      // when subscribed currently both actions are resulting with buttons being disabled
      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(pageFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
      (pageFormService.toggleSaveButton as jest.Mock).mockClear();

      component.ngOnDestroy();

      buttonsAction$.next(PageContentEntityToolbarButtons.Save);
      expect(pageFormService.toggleSaveButton).not.toHaveBeenCalled();
    });
  });

  describe('pageFormSubmit', () => {
    it('should prevent default on passed event and return early if page can not be submitted', () => {
      (pageFormService.updateHandler as jest.Mock).mockClear();
      (pageFormService.createHandler as jest.Mock).mockClear();
      component.entity = mockPageNew;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      component.entityFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(pageFormService.updateHandler).not.toHaveBeenCalled();
      expect(pageFormService.createHandler).not.toHaveBeenCalled();
    });

    it('should prevent default on passed event and call save action if page can be submitted', () => {
      (pageFormService.updateHandler as jest.Mock).mockClear();
      (pageFormService.createHandler as jest.Mock).mockClear();
      component.entity = mockPageEdit;
      fixture.detectChanges();

      const mockEvent: any = { preventDefault: jest.fn() };

      component.entityFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      expect(pageFormService.updateHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('onArticlesUpdate', () => {
    it('should update page articles and enable save and reset buttons', () => {
      component.entity = mockPageEdit;
      fixture.detectChanges();

      component.onArticlesUpdate([]);
      expect(component.entity).toEqual({
        ...component.entity,
        articles: [],
      });
      expect(pageFormService.toggleResetButton).toHaveBeenLastCalledWith(true);
      expect(pageFormService.toggleSaveButton).toHaveBeenLastCalledWith(true);
    });
  });

  describe('onSearchResult', () => {
    it('should return early if event is empty array otherwise prepend event items to page articles', () => {
      component.entity = mockPageEdit;
      fixture.detectChanges();

      jest.spyOn(component, 'onArticlesUpdate');

      component.onSearchResult([]);
      expect(component.onArticlesUpdate).not.toHaveBeenCalled();
      expect((component.entity.articles as Article[])[0]).toEqual(
        mockPageEdit.articles[0],
      );
      expect(component.entity.articles?.length).toEqual(1);

      const mockNewArticleItem: Article = {
        _id: '654456',
        title: 'Some Title',
      };
      component.onSearchResult([mockNewArticleItem]);

      expect(component.onArticlesUpdate).toHaveBeenCalledWith([
        mockNewArticleItem,
        mockPageEdit.articles[0],
      ]);
      expect((component.entity.articles as Article[])[0]).toEqual(
        mockNewArticleItem,
      );
      expect(component.entity.articles?.length).toEqual(2);
    });
  });

  describe('resetAction', () => {
    it('should get last saved version of page and disable save and reset buttons', () => {
      component.entity = { ...mockPageEdit };
      component.entity.title = 'Test ' + component.entity.title;
      (pageFormService.getLastSave as jest.Mock).mockReturnValueOnce(
        of({
          data: {
            page: mockPageEdit,
          },
        }),
      );
      fixture.detectChanges();

      expect(component.entity.title).toEqual('Test Foo');

      buttonsAction$.next(PageContentEntityToolbarButtons.Reset);

      expect(component.entity.title).toEqual('Foo');
      expect(pageFormService.toggleResetButton).toHaveBeenLastCalledWith(false);
      expect(pageFormService.toggleSaveButton).toHaveBeenLastCalledWith(false);
    });
  });

  describe('pageArticles', () => {
    it('should return empty array if page is not defined otherwise page articles', () => {
      component.entity = { _id: '123', title: 'Bar', slug: 'bar' };
      fixture.detectChanges();

      expect(component.pageArticles).toEqual([]);

      component.entity = mockPageEdit;
      fixture.detectChanges();

      expect(component.pageArticles).toEqual(mockPageEdit.articles);
    });
  });

  describe('pageFormValueChangeHandler', () => {
    it('should enable reset and save buttons on change', () => {
      component.entity = mockPageEdit;
      fixture.detectChanges();

      component.entityForm.markAsDirty();
      component.entityForm.setValue({
        title: 'Hello',
        slug: 'hello',
      });

      expect(pageFormService.toggleResetButton).toHaveBeenLastCalledWith(true);
      expect(pageFormService.toggleSaveButton).toHaveBeenLastCalledWith(true);
    });
  });

  describe('queryParamsHandler', () => {
    beforeEach(() => {
      (pageFormService.cleanQueryParams as jest.Mock).mockClear();
      (pageFormService.getUpdateHandler as jest.Mock).mockClear();
      component.entity = mockPageEdit;
      fixture.detectChanges();
    });

    it('should return early if params are empty', () => {
      mockActivatedRouteQueryParams$.next({});
      expect(pageFormService.cleanQueryParams).not.toHaveBeenCalled();
      expect(pageFormService.getUpdateHandler).not.toHaveBeenCalled();
    });

    it('should clean query and return early if params "new" property is empty', () => {
      mockActivatedRouteQueryParams$.next({
        foo: 'bar',
      });
      expect(pageFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockPageEdit._id,
      );
      expect(pageFormService.getUpdateHandler).not.toHaveBeenCalled();
    });

    it('should add new article and clean query if params "new" property is NOT empty', () => {
      (pageFormService.cleanQueryParams as jest.Mock).mockResolvedValueOnce(
        true,
      );
      (pageFormService.getUpdateHandler as jest.Mock).mockReturnValue(of({}));
      mockActivatedRouteQueryParams$.next({
        new: true,
        id: '666',
        kind: 'article',
      });
      expect(pageFormService.getUpdateHandler).toHaveBeenLastCalledWith({
        _id: mockPageEdit._id,
        title: mockPageEdit.title,
        slug: mockPageEdit.slug,
        articles: [
          '666',
          ...mockPageEdit.articles.map((article) => article._id),
        ],
      });

      expect(pageFormService.cleanQueryParams).toHaveBeenLastCalledWith(
        mockPageEdit._id,
      );
    });
  });
});
