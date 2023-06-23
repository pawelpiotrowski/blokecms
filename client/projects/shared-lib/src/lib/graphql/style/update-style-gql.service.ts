import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateStyleResponse } from './style.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateStyleGQL extends Mutation<UpdateStyleResponse> {
  override document = gql`
    mutation updateStyle($input: StyleInputUpdate!) {
      updateStyle(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
