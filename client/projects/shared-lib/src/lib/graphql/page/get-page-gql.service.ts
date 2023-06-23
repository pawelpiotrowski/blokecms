import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetPageResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class GetPageGQL extends Query<GetPageResponse> {
  override document = gql`
    query page($input: PageInputFilter!) {
      page(input: $input) {
        _id
        title
        slug
        authorId
        articles {
          _id
          title
          authorId
          content {
            refId
            kind
          }
        }
      }
    }
  `;
}
