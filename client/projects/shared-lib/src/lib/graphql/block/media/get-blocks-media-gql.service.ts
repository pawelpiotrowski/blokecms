import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksMediaResponse } from './block-media.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksMediaGQL extends Query<AllBlocksMediaResponse> {
  override document = gql`
    query blocksMedia {
      blocksMedia {
        _id
        name
      }
    }
  `;
}
