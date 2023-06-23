import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetStyleMinifiedResponse } from './style.interface';

@Injectable({
  providedIn: 'root',
})
export class GetStyleMinifiedGQL extends Query<GetStyleMinifiedResponse> {
  override document = gql`
    query style($input: StyleInputFilter!) {
      style(input: $input) {
        _id
        name
        minified
      }
    }
  `;
}
