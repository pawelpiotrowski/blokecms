import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreatePageGQL,
  CreatePageInput,
  CreatePageResponse,
  GetPageGQL,
  GetPageResponse,
  GetPagesGQL,
  Page,
  UpdatePageGQL,
  UpdatePageInput,
  UpdatePageResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class PageFormService extends PageContentEntityFormService<
  CreatePageResponse,
  UpdatePageResponse,
  GetPageResponse,
  Page
> {
  constructor(
    getPages: GetPagesGQL,
    createPage: CreatePageGQL,
    updatePage: UpdatePageGQL,
    getPage: GetPageGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getPages.document;
    this.entityCreateMutation = createPage;
    this.entityUpdateMutation = updatePage;
    this.entityQuery = getPage;
    this.entityLabel = 'Page';
    this.entityRedirectUrl = 'pages';
    this.entityKind = 'page';
  }

  createHandler(input: CreatePageInput) {
    this.create<CreatePageInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdatePageInput) {
    this.update<UpdatePageInput>(input, this.postUpdateDataMapping);
  }

  getUpdateHandler(input: UpdatePageInput) {
    return this.updateMutation<UpdatePageInput>(input);
  }

  private postCreateDataMapping(resp: MutationResult<CreatePageResponse>) {
    return resp && resp.data && resp.data.createPage
      ? resp.data.createPage
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdatePageResponse>) {
    return resp && resp.data && resp.data.updatePage
      ? resp.data.updatePage
      : undefined;
  }
}
