import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateBlockMediaResponse } from './block-media.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateBlockMediaGQL extends Mutation<UpdateBlockMediaResponse> {
  override document = gql`
    mutation updateBlockMedia($input: BlockMediaInputUpdate!) {
      updateBlockMedia(input: $input) {
        _id
        name
        url
      }
    }
  `;
}
