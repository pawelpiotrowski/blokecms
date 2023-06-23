import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateBlockCodeResponse } from './block-code.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateBlockCodeGQL extends Mutation<CreateBlockCodeResponse> {
  override document = gql`
    mutation createBlockCode($input: BlockCodeInput!) {
      createBlockCode(input: $input) {
        _id
        name
        code
        lang
        showLineNumbers
      }
    }
  `;
}
