import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllPagesCountResponse } from './page.interface';

@Injectable({
  providedIn: 'root',
})
export class GetPagesCountGQL extends Query<AllPagesCountResponse> {
  override document = gql`
    query pagesCount {
      pagesCount
    }
  `;
}
