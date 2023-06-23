import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { CreateScriptResponse } from './script.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateScriptGQL extends Mutation<CreateScriptResponse> {
  override document = gql`
    mutation createScript($input: ScriptInput!) {
      createScript(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
