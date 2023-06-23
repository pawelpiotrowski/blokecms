import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreateNavigationGQL,
  CreateNavigationInput,
  CreateNavigationResponse,
  GetNavigationGQL,
  GetNavigationResponse,
  GetNavigationsGQL,
  Navigation,
  UpdateNavigationGQL,
  UpdateNavigationInput,
  UpdateNavigationResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class NavigationFormService extends PageContentEntityFormService<
  CreateNavigationResponse,
  UpdateNavigationResponse,
  GetNavigationResponse,
  Navigation
> {
  constructor(
    getNavigations: GetNavigationsGQL,
    createNavigation: CreateNavigationGQL,
    updateNavigation: UpdateNavigationGQL,
    getNavigation: GetNavigationGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getNavigations.document;
    this.entityCreateMutation = createNavigation;
    this.entityUpdateMutation = updateNavigation;
    this.entityQuery = getNavigation;
    this.entityLabel = 'Navigation';
    this.entityRedirectUrl = 'settings/navigations';
    this.entityKind = 'navigation';
  }

  createHandler(input: CreateNavigationInput) {
    this.create<CreateNavigationInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateNavigationInput) {
    this.update<UpdateNavigationInput>(input, this.postUpdateDataMapping);
  }

  getUpdateHandler(input: UpdateNavigationInput) {
    return this.updateMutation(input);
  }

  private postCreateDataMapping(
    resp: MutationResult<CreateNavigationResponse>,
  ) {
    return resp && resp.data && resp.data.createNavigation
      ? resp.data.createNavigation
      : undefined;
  }

  private postUpdateDataMapping(
    resp: MutationResult<UpdateNavigationResponse>,
  ) {
    return resp && resp.data && resp.data.updateNavigation
      ? resp.data.updateNavigation
      : undefined;
  }
}
