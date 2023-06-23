import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteStyleGQL extends Mutation {
  override document = gql`
    mutation deleteStyle($id: String!) {
      deleteStyle(id: $id) {
        _id
      }
    }
  `;
}
