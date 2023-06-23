import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllPagesResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class GetPagesGQL extends Query<AllPagesResponse> {
  override document = gql`
    query pages {
      pages {
        _id
        slug
        title
        authorId
      }
    }
  `;
}
