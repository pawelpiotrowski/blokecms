import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { GetScriptMinifiedResponse } from './script.interface';

@Injectable({
  providedIn: 'root',
})
export class GetScriptMinifiedGQL extends Query<GetScriptMinifiedResponse> {
  override document = gql`
    query script($input: ScriptInputFilter!) {
      script(input: $input) {
        _id
        name
        minified
      }
    }
  `;
}
