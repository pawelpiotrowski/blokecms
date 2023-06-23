import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreateScriptGQL,
  CreateScriptInput,
  CreateScriptResponse,
  GetScriptGQL,
  GetScriptResponse,
  GetScriptsGQL,
  Script,
  UpdateScriptGQL,
  UpdateScriptInput,
  UpdateScriptResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class ScriptFormService extends PageContentEntityFormService<
  CreateScriptResponse,
  UpdateScriptResponse,
  GetScriptResponse,
  Script
> {
  constructor(
    getScripts: GetScriptsGQL,
    createScript: CreateScriptGQL,
    updateScript: UpdateScriptGQL,
    getScript: GetScriptGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getScripts.document;
    this.entityCreateMutation = createScript;
    this.entityUpdateMutation = updateScript;
    this.entityQuery = getScript;
    this.entityLabel = 'Script';
    this.entityRedirectUrl = 'settings/scripts';
    this.entityKind = 'script';
  }

  createHandler(input: CreateScriptInput) {
    this.create<CreateScriptInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateScriptInput) {
    this.update<UpdateScriptInput>(input, this.postUpdateDataMapping);
  }

  getUpdateHandler(input: UpdateScriptInput) {
    return this.updateMutation(input);
  }

  private postCreateDataMapping(resp: MutationResult<CreateScriptResponse>) {
    return resp && resp.data && resp.data.createScript
      ? resp.data.createScript
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateScriptResponse>) {
    return resp && resp.data && resp.data.updateScript
      ? resp.data.updateScript
      : undefined;
  }
}
