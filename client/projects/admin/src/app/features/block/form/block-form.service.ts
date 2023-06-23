import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  BlockText,
  CreateBlockTextGQL,
  CreateBlockTextInput,
  CreateBlockTextResponse,
  GetBlocksTextGQL,
  GetBlockTextGQL,
  GetBlockTextResponse,
  UpdateBlockTextGQL,
  UpdateBlockTextInput,
  UpdateBlockTextResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class BlockFormService extends PageContentEntityFormService<
  CreateBlockTextResponse,
  UpdateBlockTextResponse,
  GetBlockTextResponse,
  BlockText
> {
  constructor(
    createBlockText: CreateBlockTextGQL,
    updateBlockText: UpdateBlockTextGQL,
    getBlocks: GetBlocksTextGQL,
    getBlock: GetBlockTextGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getBlocks.document;
    this.entityCreateMutation = createBlockText;
    this.entityUpdateMutation = updateBlockText;
    this.entityQuery = getBlock;
    this.entityLabel = 'Block';
    this.entityRedirectUrl = 'blocks';
    this.entityKind = 'Text';
  }

  createHandler(input: CreateBlockTextInput) {
    this.create<CreateBlockTextInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateBlockTextInput) {
    this.update<UpdateBlockTextInput>(input, this.postUpdateDataMapping);
  }

  private postCreateDataMapping(resp: MutationResult<CreateBlockTextResponse>) {
    return resp && resp.data && resp.data.createBlockText
      ? resp.data.createBlockText
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateBlockTextResponse>) {
    return resp && resp.data && resp.data.updateBlockText
      ? resp.data.updateBlockText
      : undefined;
  }
}
