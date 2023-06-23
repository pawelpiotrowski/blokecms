import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetBlocksByNameResponse } from './block.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksByNameGQL extends Query<GetBlocksByNameResponse> {
  override document = gql`
    query findBlocksByName($name: String!) {
      findBlocksByName(name: $name) {
        ... on BlockText {
          _id
          name
          kind
          html
        }
        ... on BlockMedia {
          _id
          name
          kind
          url
        }
        ... on BlockCode {
          _id
          name
          kind
          code
        }
      }
    }
  `;
}
