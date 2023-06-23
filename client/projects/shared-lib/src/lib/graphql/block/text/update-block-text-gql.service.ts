import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateBlockTextResponse } from './block-text.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateBlockTextGQL extends Mutation<UpdateBlockTextResponse> {
  override document = gql`
    mutation updateBlockText($input: BlockTextInputUpdate!) {
      updateBlockText(input: $input) {
        _id
        name
        text
      }
    }
  `;
}
