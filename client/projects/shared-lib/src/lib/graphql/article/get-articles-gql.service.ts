import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllArticlesResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class GetArticlesGQL extends Query<AllArticlesResponse> {
  override document = gql`
    query articles {
      articles {
        _id
        title
        authorId
      }
    }
  `;
}
