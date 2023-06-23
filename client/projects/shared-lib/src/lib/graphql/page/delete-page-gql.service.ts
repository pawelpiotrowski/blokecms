import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeletePageGQL extends Mutation {
  override document = gql`
    mutation deletePage($id: String!) {
      deletePage(id: $id) {
        _id
      }
    }
  `;
}
