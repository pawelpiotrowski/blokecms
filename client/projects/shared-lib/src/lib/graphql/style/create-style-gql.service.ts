import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateStyleResponse } from './style.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateStyleGQL extends Mutation<CreateStyleResponse> {
  override document = gql`
    mutation createStyle($input: StyleInput!) {
      createStyle(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
