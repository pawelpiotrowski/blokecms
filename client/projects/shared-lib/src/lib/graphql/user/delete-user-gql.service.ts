import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserGQL extends Mutation {
  override document = gql`
    mutation deleteUser($id: String!) {
      deleteUser(id: $id) {
        _id
      }
    }
  `;
}
