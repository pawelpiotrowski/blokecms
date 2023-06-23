import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteScriptGQL extends Mutation {
  override document = gql`
    mutation deleteScript($id: String!) {
      deleteScript(id: $id) {
        _id
      }
    }
  `;
}
