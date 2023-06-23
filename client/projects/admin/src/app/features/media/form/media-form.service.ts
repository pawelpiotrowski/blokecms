import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  ApiUpload,
  BlockMedia,
  CreateBlockMediaGQL,
  CreateBlockMediaResponse,
  GetBlocksMediaGQL,
  GetBlockMediaGQL,
  UpdateBlockMediaGQL,
  UpdateBlockMediaInput,
  UpdateBlockMediaResponse,
  GetBlockMediaResponse,
} from 'shared-lib';
import { appDisplayErrorMessage } from '../../../app.actions';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class MediaFormService extends PageContentEntityFormService<
  CreateBlockMediaResponse,
  UpdateBlockMediaResponse,
  GetBlockMediaResponse,
  BlockMedia
> {
  constructor(
    createBlockMedia: CreateBlockMediaGQL,
    updateBlockMedia: UpdateBlockMediaGQL,
    getMedias: GetBlocksMediaGQL,
    getMedia: GetBlockMediaGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getMedias.document;
    this.entityCreateMutation = createBlockMedia;
    this.entityUpdateMutation = updateBlockMedia;
    this.entityQuery = getMedia;
    this.entityLabel = 'Multimedia';
    this.entityRedirectUrl = 'multimedia';
    this.entityKind = 'media';
  }

  uploadCreateHandler(input: ApiUpload) {
    this.create<ApiUpload>(input, this.postCreateDataMapping);
  }

  uploadUpdateHandler(data: Partial<ApiUpload>, _id: string) {
    const input: UpdateBlockMediaInput = {
      _id,
      ...data,
    };

    this.update<UpdateBlockMediaInput>(input, this.postUpdateDataMapping);
  }

  uploadErrorHandler(err: any) {
    const message = 'Error uploading file, please try again';

    this.actions.dispatch(appDisplayErrorMessage({ message }));
    this.toggleSaveButton(true);
    this.toggleResetButton(true);
    this.logger.error(message, MediaFormService.name, err);
  }

  private postCreateDataMapping(
    resp: MutationResult<CreateBlockMediaResponse>,
  ) {
    return resp && resp.data && resp.data.createBlockMedia
      ? resp.data.createBlockMedia
      : undefined;
  }

  private postUpdateDataMapping(
    resp: MutationResult<UpdateBlockMediaResponse>,
  ) {
    return resp && resp.data && resp.data.updateBlockMedia
      ? resp.data.updateBlockMedia
      : undefined;
  }
}
