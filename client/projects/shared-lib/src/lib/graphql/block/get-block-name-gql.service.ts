import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetBlockNameResponse } from './block.interface';

@Injectable({
  providedIn: 'root',
})
export class GetBlockNameGQL extends Query<GetBlockNameResponse> {
  override document = gql`
    query blockName($id: String!) {
      blockName(id: $id)
    }
  `;
}
