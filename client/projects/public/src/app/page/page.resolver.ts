import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, filter, map, Observable } from 'rxjs';
import { GetPagePublicGQL, PagePublic } from 'shared-lib';

@Injectable({
  providedIn: 'root',
})
export class PageResolver  {
  constructor(private page: GetPagePublicGQL, private router: Router) {}

  resolve(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const slug = state.url.length > 1 ? state.url.substring(1) : 'home';

    return this.page
      .fetch(
        { input: { slug } },
        {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      )
      .pipe(
        filter(({ loading }) => loading === false),
        map((result) => {
          if (result.errors?.length) {
            throw 'Error resolving page';
          }
          return result.data.page;
        }),
        catchError(() => this.router.navigateByUrl('404')),
      );
  }
}
