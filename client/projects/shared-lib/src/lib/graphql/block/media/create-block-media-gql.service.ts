import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateBlockMediaResponse } from './block-media.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateBlockMediaGQL extends Mutation<CreateBlockMediaResponse> {
  override document = gql`
    mutation createBlockMedia($input: BlockMediaInput!) {
      createBlockMedia(input: $input) {
        _id
        name
        url
      }
    }
  `;
}
