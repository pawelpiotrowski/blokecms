import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetUserResponse } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetUserGQL extends Query<GetUserResponse> {
  override document = gql`
    query user($input: UserInputFilter!) {
      user(input: $input) {
        createdBy
        createdAt
        updatedAt
        isAdmin
        username
        _id
      }
    }
  `;
}
