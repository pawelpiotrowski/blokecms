import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteNavigationGQL extends Mutation {
  override document = gql`
    mutation deleteNavigation($id: String!) {
      deleteNavigation(id: $id) {
        _id
      }
    }
  `;
}
