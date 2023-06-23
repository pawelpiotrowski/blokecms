import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllNavigationsResponse } from './navigation.interface';

@Injectable({
  providedIn: 'root',
})
export class GetNavigationsGQL extends Query<AllNavigationsResponse> {
  override document = gql`
    query navigations {
      navigations {
        _id
        name
      }
    }
  `;
}
