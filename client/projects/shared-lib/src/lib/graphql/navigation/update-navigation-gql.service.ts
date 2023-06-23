import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateNavigationResponse } from './navigation.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateNavigationGQL extends Mutation<UpdateNavigationResponse> {
  override document = gql`
    mutation updateNavigation($input: NavigationInputUpdate!) {
      updateNavigation(input: $input) {
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
