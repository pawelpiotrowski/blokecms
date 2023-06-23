import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllScriptsResponse } from './script.interface';

@Injectable({
  providedIn: 'root',
})
export class GetScriptsGQL extends Query<AllScriptsResponse> {
  override document = gql`
    query scripts {
      scripts {
        _id
        name
      }
    }
  `;
}
