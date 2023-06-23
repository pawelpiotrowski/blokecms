import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksMediaCountResponse } from './block-media.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksMediaCountGQL extends Query<AllBlocksMediaCountResponse> {
  override document = gql`
    query blocksMediaCount {
      blocksMediaCount
    }
  `;
}
