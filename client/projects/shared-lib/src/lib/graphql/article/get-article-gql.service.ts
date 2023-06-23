import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetArticleResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class GetArticleGQL extends Query<GetArticleResponse> {
  override document = gql`
    query article($input: ArticleInputFilter!) {
      article(input: $input) {
        _id
        title
        authorId
        content {
          refId
          kind
        }
      }
    }
  `;
}
