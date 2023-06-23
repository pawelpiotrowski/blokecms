import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import {
  CreateNavigationGQL,
  GetNavigationGQL,
  GetNavigationsGQL,
  LoggerService,
  UpdateNavigationGQL,
} from 'shared-lib';
import { NavigationFormService } from './navigation-form.service';

describe('NavigationFormService', () => {
  let service: NavigationFormService;
  let router: Router;
  let updateNavigation: UpdateNavigationGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createNavigationSource$ = new Subject();
  const mockCreateNavigationSource = {
    mutate: jest.fn().mockReturnValue(createNavigationSource$.asObservable()),
  };
  const updateNavigationSource$ = new Subject();
  const mockUpdateNavigationSource = {
    mutate: jest.fn().mockReturnValue(updateNavigationSource$.asObservable()),
  };
  const mockGetNavigations = { document: {} };
  const getNavigationSource$ = new Subject();
  const mockGetNavigationSource = {
    fetch: jest.fn().mockReturnValue(getNavigationSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: CreateNavigationGQL, useValue: mockCreateNavigationSource },
        { provide: UpdateNavigationGQL, useValue: mockUpdateNavigationSource },
        { provide: GetNavigationGQL, useValue: mockGetNavigationSource },
        { provide: GetNavigationsGQL, useValue: mockGetNavigations },
        NavigationFormService,
      ],
    });
    service = TestBed.inject(NavigationFormService);
    router = TestBed.inject(Router);
    updateNavigation = TestBed.inject(UpdateNavigationGQL);
  });

  describe('createHandler', () => {
    const mockNavigationCreateInput = {
      name: 'foo',
      items: [
        { label: 'home', pageId: '12345' },
        { label: 'google', url: 'https://google.com' },
      ],
    };
    const mockCreatedNavigation = {
      createNavigation: {
        _id: '123',
        name: mockNavigationCreateInput.name,
        links: [
          { label: 'home', pageId: '12345', url: null, slug: 'home' },
          {
            label: 'google',
            pageId: null,
            url: 'https://google.com',
            slug: null,
          },
        ],
      },
    };

    it('should call create navigation mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const createSpy = jest.spyOn(service, 'create');

      service.createHandler(mockNavigationCreateInput);

      const dataMap: any = createSpy.mock.calls[0][1];

      expect(createSpy).toHaveBeenLastCalledWith(
        mockNavigationCreateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockCreatedNavigation })).toEqual(
        mockCreatedNavigation.createNavigation,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('updateHandler', () => {
    const mockNavigationUpdateInput = {
      name: 'bar',
      _id: '321456',
    };
    const mockUpdatedNavigation = {
      updateNavigation: {
        _id: '321456',
        name: mockNavigationUpdateInput.name,
      },
    };

    it('should call update navigation mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      const updateSpy = jest.spyOn(service, 'update');

      service.updateHandler(mockNavigationUpdateInput);

      const dataMap: any = updateSpy.mock.calls[0][1];

      expect(updateSpy).toHaveBeenLastCalledWith(
        mockNavigationUpdateInput,
        expect.any(Function),
      );
      expect(dataMap({ data: mockUpdatedNavigation })).toEqual(
        mockUpdatedNavigation.updateNavigation,
      );
      expect(dataMap({ data: null })).toEqual(undefined);
    }));
  });

  describe('getUpdateHandler', () => {
    const mockNavigationUpdateInput = {
      name: 'foobar',
      _id: '654321',
    };
    const mockUpdatedNavigation = {
      updateNavigation: mockNavigationUpdateInput,
    };

    it('should get update navigation mutation', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (updateNavigation.mutate as jest.Mock).mockClear();
      service.getUpdateHandler(mockNavigationUpdateInput).subscribe();
      updateNavigationSource$.next({
        loading: false,
        data: mockUpdatedNavigation,
      });
      tick();
      expect(updateNavigation.mutate).toHaveBeenCalled();
    }));
  });
});
