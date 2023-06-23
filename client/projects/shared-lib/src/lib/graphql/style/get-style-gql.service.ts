import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetStyleResponse } from './style.interface';

@Injectable({
  providedIn: 'root',
})
export class GetStyleGQL extends Query<GetStyleResponse> {
  override document = gql`
    query style($input: StyleInputFilter!) {
      style(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
