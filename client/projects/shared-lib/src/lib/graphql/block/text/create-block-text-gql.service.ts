import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateBlockTextResponse } from './block-text.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateBlockTextGQL extends Mutation<CreateBlockTextResponse> {
  override document = gql`
    mutation createBlockText($input: BlockTextInput!) {
      createBlockText(input: $input) {
        _id
        name
        text
      }
    }
  `;
}
