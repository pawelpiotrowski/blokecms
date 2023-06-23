import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateArticleResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateArticleGQL extends Mutation<CreateArticleResponse> {
  override document = gql`
    mutation createArticle($input: ArticleInput!) {
      createArticle(input: $input) {
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
