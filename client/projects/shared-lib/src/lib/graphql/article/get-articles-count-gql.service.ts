import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllArticlesCountResponse } from './article.interface';

@Injectable({
  providedIn: 'root',
})
export class GetArticlesCountGQL extends Query<AllArticlesCountResponse> {
  override document = gql`
    query articlesCount {
      articlesCount
    }
  `;
}
