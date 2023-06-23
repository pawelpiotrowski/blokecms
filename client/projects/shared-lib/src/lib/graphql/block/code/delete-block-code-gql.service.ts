import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteBlockCodeGQL extends Mutation {
  override document = gql`
    mutation deleteBlockCode($id: String!) {
      deleteBlockCode(id: $id) {
        _id
      }
    }
  `;
}
