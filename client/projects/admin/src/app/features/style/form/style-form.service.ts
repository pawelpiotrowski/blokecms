import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreateStyleGQL,
  CreateStyleInput,
  CreateStyleResponse,
  GetStyleGQL,
  GetStyleResponse,
  GetStylesGQL,
  Style,
  UpdateStyleGQL,
  UpdateStyleInput,
  UpdateStyleResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class StyleFormService extends PageContentEntityFormService<
  CreateStyleResponse,
  UpdateStyleResponse,
  GetStyleResponse,
  Style
> {
  constructor(
    getStyles: GetStylesGQL,
    createStyle: CreateStyleGQL,
    updateStyle: UpdateStyleGQL,
    getStyle: GetStyleGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getStyles.document;
    this.entityCreateMutation = createStyle;
    this.entityUpdateMutation = updateStyle;
    this.entityQuery = getStyle;
    this.entityLabel = 'Style';
    this.entityRedirectUrl = 'settings/styles';
    this.entityKind = 'style';
  }

  createHandler(input: CreateStyleInput) {
    this.create<CreateStyleInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateStyleInput) {
    this.update<UpdateStyleInput>(input, this.postUpdateDataMapping);
  }

  getUpdateHandler(input: UpdateStyleInput) {
    return this.updateMutation(input);
  }

  private postCreateDataMapping(resp: MutationResult<CreateStyleResponse>) {
    return resp && resp.data && resp.data.createStyle
      ? resp.data.createStyle
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateStyleResponse>) {
    return resp && resp.data && resp.data.updateStyle
      ? resp.data.updateStyle
      : undefined;
  }
}
