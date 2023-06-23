import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetBlockCodeResponse } from './block-code.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlockCodeGQL extends Query<GetBlockCodeResponse> {
  override document = gql`
    query blockCode($input: BlockCodeInputFilter!) {
      blockCode(input: $input) {
        _id
        name
        code
        lang
        showLineNumbers
      }
    }
  `;
}
