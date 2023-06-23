import { Component, OnInit } from '@angular/core';
import { catchError, filter, map, of } from 'rxjs';
import { GetNavigationGQL } from 'shared-lib';

@Component({
  selector: 'public-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  nav$ = this.getNavigation.fetch({ input: { name: 'main' } }).pipe(
    filter(({ loading }) => loading === false),
    map((resp) => resp.data.navigation),
    catchError((err) => of(null)),
  );

  constructor(private getNavigation: GetNavigationGQL) {}
}
