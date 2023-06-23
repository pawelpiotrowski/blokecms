import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksTextResponse } from './block-text.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksTextGQL extends Query<AllBlocksTextResponse> {
  override document = gql`
    query blocksText {
      blocksText {
        _id
        name
      }
    }
  `;
}
