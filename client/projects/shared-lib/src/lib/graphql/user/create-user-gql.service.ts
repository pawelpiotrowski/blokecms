import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateUserResponse } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateUserGQL extends Mutation<CreateUserResponse> {
  override document = gql`
    mutation createUser($input: UserInput!) {
      createUser(input: $input) {
        _id
        username
        isAdmin
      }
    }
  `;
}
