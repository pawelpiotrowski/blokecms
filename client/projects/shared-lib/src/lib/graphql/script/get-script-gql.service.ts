import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetScriptResponse } from './script.interface';

@Injectable({
  providedIn: 'root',
})
export class GetScriptGQL extends Query<GetScriptResponse> {
  override document = gql`
    query script($input: ScriptInputFilter!) {
      script(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
