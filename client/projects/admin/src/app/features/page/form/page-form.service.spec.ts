import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreatePageGQL,
  GetPageGQL,
  GetPagesGQL,
  LoggerService,
  UpdatePageGQL,
} from 'shared-lib';
import { PageFormService } from './page-form.service';

describe('PageFormService', () => {
  let service: PageFormService;
  let router: Router;
  let updatePage: UpdatePageGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createPageSource$ = new Subject();
  const mockCreatePageSource = {
    mutate: jest.fn().mockReturnValue(createPageSource$.asObservable()),
  };
  const updatePageSource$ = new Subject();
  const mockUpdatePageSource = {
    mutate: jest.fn().mockReturnValue(updatePageSource$.asObservable()),
  };
  const mockGetPages = { document: {} };
  const getPageSource$ = new Subject();
  const mockGetPageSource = {
    fetch: jest.fn().mockReturnValue(getPageSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreatePageGQL, useValue: mockCreatePageSource },
        { provide: UpdatePageGQL, useValue: mockUpdatePageSource },
        { provide: GetPageGQL, useValue: mockGetPageSource },
        { provide: GetPagesGQL, useValue: mockGetPages },
        PageFormService,
      ],
    });
    service = TestBed.inject(PageFormService);
    router = TestBed.inject(Router);
    updatePage = TestBed.inject(UpdatePageGQL);
  });

  describe('createHandler', () => {
    const mockPageCreateInput = {
      title: 'Foo',
      slug: 'foo',
      content: [],
    };
    const mockCreatedPage = {
      createPage: {
        _id: '123',
        ...mockPageCreateInput,
      },
    };

    it('should call create page mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockPageCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockPageCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedPage })).toEqual(
        mockCreatedPage.createPage,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockPageUpdateInput = {
      _id: '123',
      title: 'Foo',
      slug: 'foo',
      content: [],
    };
    const mockUpdatedPage = {
      updatePage: {
        ...mockPageUpdateInput,
      },
    };

    it('should call update page mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockPageUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockPageUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedPage })).toEqual(
        mockUpdatedPage.updatePage,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('getUpdateHandler', () => {
    const mockPageUpdateInput = {
      title: 'Hello',
      _id: '444',
    };
    const mockUpdatedPage = {
      updatePage: {
        ...mockPageUpdateInput,
      },
    };

    it('should get update page mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (updatePage.mutate as jest.Mock).mockClear();
      service.getUpdateHandler(mockPageUpdateInput).subscribe();
      updatePageSource$.next({ loading: false, data: mockUpdatedPage });
      tick();
      expect(updatePage.mutate).toHaveBeenCalled();
    }));
  });
});
