import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllUsersResponse } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetUsersGQL extends Query<AllUsersResponse> {
  override document = gql`
    query users {
      users {
        createdAt
        updatedAt
        isAdmin
        username
        _id
      }
    }
  `;
}
