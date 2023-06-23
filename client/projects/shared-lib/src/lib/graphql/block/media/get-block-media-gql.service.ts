import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetBlockMediaResponse } from './block-media.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlockMediaGQL extends Query<GetBlockMediaResponse> {
  override document = gql`
    query blockMedia($input: BlockMediaInputFilter!) {
      blockMedia(input: $input) {
        _id
        name
        url
      }
    }
  `;
}
