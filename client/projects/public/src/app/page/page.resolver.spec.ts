import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { GetPagePublicGQL } from 'shared-lib';

import { PageResolver } from './page.resolver';

describe('PageResolver', () => {
  let resolver: PageResolver;
  let getPageGql: GetPagePublicGQL;
  let router: Router;

  const getPageSource$ = new Subject();
  const mockGetPageSource = {
    fetch: jest.fn().mockReturnValue(getPageSource$.asObservable()),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: GetPagePublicGQL, useValue: mockGetPageSource },
        Router,
      ],
    });
    resolver = TestBed.inject(PageResolver);
    getPageGql = TestBed.inject(GetPagePublicGQL);
    router = TestBed.inject(Router);
  });

  describe('resolve', () => {
    it('should call fetch page data with slug "home" if url length is 1 or less', () => {
      resolver.resolve(null as any, { url: '/', root: null as any });

      expect(getPageGql.fetch).toHaveBeenLastCalledWith(
        { input: { slug: 'home' } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      );
    });

    it('should call fetch page data with passed slug if url length more than 1', () => {
      resolver.resolve(null as any, { url: '/hello', root: null as any });

      expect(getPageGql.fetch).toHaveBeenLastCalledWith(
        { input: { slug: 'hello' } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      );
    });

    it('should resolve page data', (done) => {
      const mockPage = {
        slug: 'test',
        _id: '123',
        title: 'Test',
      };

      resolver
        .resolve(null as any, { url: '/', root: null as any })
        .subscribe((page) => {
          expect(page).toEqual(mockPage);
          done();
        });

      getPageSource$.next({
        loading: false,
        data: {
          page: mockPage,
        },
      });
    });

    it('should redirect to 404 on error', (done) => {
      jest.spyOn(router, 'navigateByUrl');

      resolver.resolve(null as any, { url: '/', root: null as any }).subscribe({
        next: () => {},
        error: () => {
          expect(router.navigateByUrl).toHaveBeenLastCalledWith('404');
          done();
        },
      });

      getPageSource$.next({
        loading: false,
        errors: [test],
      });
    });
  });
});
