import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetArticlesByTitleResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class GetArticlesByTitleGQL extends Query<GetArticlesByTitleResponse> {
  override document = gql`
    query findArticlesByTitle($title: String!) {
      findArticlesByTitle(title: $title) {
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
