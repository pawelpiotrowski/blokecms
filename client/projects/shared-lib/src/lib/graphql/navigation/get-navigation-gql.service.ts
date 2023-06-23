import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetNavigationResponse } from './navigation.interface';

@Injectable({
  providedIn: 'root',
})
export class GetNavigationGQL extends Query<GetNavigationResponse> {
  override document = gql`
    query navigation($input: NavigationInputFilter!) {
      navigation(input: $input) {
        _id
        name
        links {
          label
          slug
          pageId
          url
        }
      }
    }
  `;
}
