import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { AllBlocksCodeResponse } from './block-code.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlocksCodeGQL extends Query<AllBlocksCodeResponse> {
  override document = gql`
    query blocksCode {
      blocksCode {
        _id
        name
      }
    }
  `;
}
