import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateUserResponse } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserGQL extends Mutation<UpdateUserResponse> {
  override document = gql`
    mutation updateUser($input: UserInputUpdate!) {
      updateUser(input: $input) {
        _id
        username
        isAdmin
      }
    }
  `;
}
