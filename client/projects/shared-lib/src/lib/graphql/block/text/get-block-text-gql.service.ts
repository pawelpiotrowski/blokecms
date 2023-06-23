import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetBlockTextResponse } from './block-text.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlockTextGQL extends Query<GetBlockTextResponse> {
  override document = gql`
    query blockText($input: BlockTextInputFilter!) {
      blockText(input: $input) {
        _id
        name
        text
        jsonDoc
        html
      }
    }
  `;
}
