import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreateBlockCodeResponse,
  UpdateBlockCodeResponse,
  GetBlockCodeResponse,
  BlockCode,
  CreateBlockCodeGQL,
  GetBlockCodeGQL,
  GetBlocksCodeGQL,
  UpdateBlockCodeGQL,
  CreateBlockCodeInput,
  UpdateBlockCodeInput,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class CodeFormService extends PageContentEntityFormService<
  CreateBlockCodeResponse,
  UpdateBlockCodeResponse,
  GetBlockCodeResponse,
  BlockCode
> {
  constructor(
    createBlockCode: CreateBlockCodeGQL,
    updateBlockCode: UpdateBlockCodeGQL,
    getBlocks: GetBlocksCodeGQL,
    getBlock: GetBlockCodeGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getBlocks.document;
    this.entityCreateMutation = createBlockCode;
    this.entityUpdateMutation = updateBlockCode;
    this.entityQuery = getBlock;
    this.entityLabel = 'Code Block';
    this.entityRedirectUrl = 'code-blocks';
    this.entityKind = 'Code';
  }

  createHandler(input: CreateBlockCodeInput) {
    this.create<CreateBlockCodeInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateBlockCodeInput) {
    this.update<UpdateBlockCodeInput>(input, this.postUpdateDataMapping);
  }

  private postCreateDataMapping(resp: MutationResult<CreateBlockCodeResponse>) {
    return resp && resp.data && resp.data.createBlockCode
      ? resp.data.createBlockCode
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateBlockCodeResponse>) {
    return resp && resp.data && resp.data.updateBlockCode
      ? resp.data.updateBlockCode
      : undefined;
  }
}
