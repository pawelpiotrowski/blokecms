import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { UpdateScriptResponse } from './script.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateScriptGQL extends Mutation<UpdateScriptResponse> {
  override document = gql`
    mutation updateScript($input: ScriptInputUpdate!) {
      updateScript(input: $input) {
        _id
        name
        formatted
      }
    }
  `;
}
