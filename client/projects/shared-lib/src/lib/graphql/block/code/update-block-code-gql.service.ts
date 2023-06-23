import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateBlockCodeResponse } from './block-code.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateBlockCodeGQL extends Mutation<UpdateBlockCodeResponse> {
  override document = gql`
    mutation updateBlockCode($input: BlockCodeInputUpdate!) {
      updateBlockCode(input: $input) {
        _id
        name
        code
        lang
        showLineNumbers
      }
    }
  `;
}
