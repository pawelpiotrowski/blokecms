import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetPagesByTitleOrSlugResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class GetPagesByTitleOrSlugGQL extends Query<GetPagesByTitleOrSlugResponse> {
  override document = gql`
    query findPagesByTitleOrSlug($arg: String!) {
      findPagesByTitleOrSlug(arg: $arg) {
        _id
        title
        slug
      }
    }
  `;
}
