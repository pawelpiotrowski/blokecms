import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteBlockTextGQL extends Mutation {
  override document = gql`
    mutation deleteBlockText($id: String!) {
      deleteBlockText(id: $id) {
        _id
      }
    }
  `;
}
