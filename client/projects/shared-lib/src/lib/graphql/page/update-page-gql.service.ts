import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdatePageResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdatePageGQL extends Mutation<UpdatePageResponse> {
  override document = gql`
    mutation updatePage($input: PageInputUpdate!) {
      updatePage(input: $input) {
        _id
        title
        slug
        articles {
          _id
        }
      }
    }
  `;
}
