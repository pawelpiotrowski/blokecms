import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksCodeCountResponse } from './block-code.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksCodeCountGQL extends Query<AllBlocksCodeCountResponse> {
  override document = gql`
    query blocksCodeCount {
      blocksCodeCount
    }
  `;
}
