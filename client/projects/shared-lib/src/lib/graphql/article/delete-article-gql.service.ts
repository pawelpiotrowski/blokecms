import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class DeleteArticleGQL extends Mutation {
  override document = gql`
    mutation deleteArticle($id: String!) {
      deleteArticle(id: $id) {
        _id
      }
    }
  `;
}
