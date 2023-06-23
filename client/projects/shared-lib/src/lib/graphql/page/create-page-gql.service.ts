import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreatePageResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class CreatePageGQL extends Mutation<CreatePageResponse> {
  override document = gql`
    mutation createPage($input: PageInput!) {
      createPage(input: $input) {
        _id
        slug
        title
        authorId
        articles {
          _id
        }
      }
    }
  `;
}
