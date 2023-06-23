import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksTextCountResponse } from './block-text.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksTextCountGQL extends Query<AllBlocksTextCountResponse> {
  override document = gql`
    query blocksTextCount {
      blocksTextCount
    }
  `;
}
