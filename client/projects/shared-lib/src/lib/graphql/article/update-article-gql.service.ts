import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateArticleResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateArticleGQL extends Mutation<UpdateArticleResponse> {
  override document = gql`
    mutation updateArticle($input: ArticleInputUpdate!) {
      updateArticle(input: $input) {
        _id
        title
        content {
          refId
          kind
        }
      }
    }
  `;
}
