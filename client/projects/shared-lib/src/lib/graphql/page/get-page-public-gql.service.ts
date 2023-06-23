import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetPagePublicResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class GetPagePublicGQL extends Query<GetPagePublicResponse> {
  override document = gql`
    query page($input: PageInputFilter!) {
      page(input: $input) {
        _id
        title
        slug
        articles {
          _id
          title
          blocks {
            ... on BlockText {
              _id
              kind
              htmlIncludeWebComponentTags
            }
            ... on BlockMedia {
              _id
              kind
              url
              isPortrait
              isSquare
              naturalHeight
              naturalWidth
            }
            ... on BlockCode {
              _id
              kind
              code
              lang
              showLineNumbers
            }
          }
        }
      }
    }
  `;
}
