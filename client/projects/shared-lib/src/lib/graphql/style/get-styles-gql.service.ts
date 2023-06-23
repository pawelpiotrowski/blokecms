import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllStylesResponse } from './style.interface';

@Injectable({
  providedIn: 'root',
})
export class GetStylesGQL extends Query<AllStylesResponse> {
  override document = gql`
    query styles {
      styles {
        _id
        name
      }
    }
  `;
}
