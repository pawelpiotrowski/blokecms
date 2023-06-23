import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateNavigationResponse } from './navigation.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateNavigationGQL extends Mutation<CreateNavigationResponse> {
  override document = gql`
    mutation createNavigation($input: NavigationInput!) {
      createNavigation(input: $input) {
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
