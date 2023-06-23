import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteBlockMediaGQL extends Mutation {
  override document = gql`
    mutation deleteBlockMedia($id: String!) {
      deleteBlockMedia(id: $id) {
        _id
      }
    }
  `;
}
