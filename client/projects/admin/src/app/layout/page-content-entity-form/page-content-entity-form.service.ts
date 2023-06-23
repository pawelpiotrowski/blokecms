import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GraphQLErrors } from '@apollo/client/errors';
import { Actions } from '@ngneat/effects-ng';
import {
  Mutation,
  MutationResult,
  Query,
  TypedDocumentNode,
} from 'apollo-angular';
import { gqlQueryRefetchOptions, isEmpty, LoggerService } from 'shared-lib';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
} from '../../app.actions';
import {
  EntityWithId,
  PageContentEntityFormPostRequestData,
} from './page-content-entity-form.interface';
import {
  pageContentEntityDisableResetButton,
  pageContentEntityDisableSaveButton,
  pageContentEntityEnableResetButton,
  pageContentEntityEnableSaveButton,
} from '../page-content-entity-layout/page-entity-content.actions';
import { filter, take } from 'rxjs';

export type PageContentEntityFormServiceDeps = [Actions, LoggerService, Router];

/**
 * Generics
 * C: Create entity GQL response
 * U: Update entity GQL response
 * G: Get entity GQL Response
 * E: Entity type
 * I: Input type
 */
export abstract class PageContentEntityFormService<C, U, G, E> {
  static deps(): PageContentEntityFormServiceDeps {
    return [inject(Actions), inject(LoggerService), inject(Router)];
  }

  protected entityListQuery!: TypedDocumentNode<unknown, unknown>;
  protected entityQuery!: Query<G>;
  protected entityCreateMutation!: Mutation<C>;
  protected entityUpdateMutation!: Mutation<U>;
  protected entityLabel!: string;
  protected entityRedirectUrl!: string;
  protected entityKind!: string;

  constructor(
    protected actions: Actions,
    protected logger: LoggerService,
    protected router: Router,
  ) {}

  toggleSaveButton(toggleTo: boolean) {
    if (toggleTo) {
      this.actions.dispatch(pageContentEntityEnableSaveButton());
      return;
    }
    this.actions.dispatch(pageContentEntityDisableSaveButton());
  }

  toggleResetButton(toggleTo: boolean) {
    if (toggleTo) {
      this.actions.dispatch(pageContentEntityEnableResetButton());
      return;
    }
    this.actions.dispatch(pageContentEntityDisableResetButton());
  }

  getLastSave(id: string) {
    return this.entityQuery
      .fetch(
        { input: { _id: id } },
        {
          fetchPolicy: 'network-only',
        },
      )
      .pipe(filter(({ loading }) => loading === false));
  }

  // This is public just to ease testing
  create<I>(input: I, dataMap: Function) {
    this.entityCreateMutation
      .mutate({ input }, this.mutationOptions())
      .pipe(
        take(1),
        filter(({ loading }) => loading === false),
      )
      .subscribe((resp: MutationResult<C>) => {
        this.createResponseHandler(resp, dataMap(resp));
      });
  }

  // This is public just to ease testing
  update<I>(input: I, dataMap: Function) {
    this.updateMutation<I>(input).subscribe((resp: MutationResult<U>) => {
      this.updateResponseHandler(resp, dataMap(resp));
    });
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  async cleanQueryParams(id: string) {
    await this.router.navigate([`/${this.entityRedirectUrl}`, id, 'edit'], {
      replaceUrl: true,
    });
  }

  protected updateMutation<I>(input: I) {
    return this.entityUpdateMutation
      .mutate({ input }, this.mutationOptions())
      .pipe(
        take(1),
        filter(({ loading }) => loading === false),
      );
  }

  private mutationOptions() {
    return gqlQueryRefetchOptions(this.entityListQuery);
  }

  private async createResponseHandler(resp: MutationResult<C>, data: E) {
    const respErrors = resp && resp.errors ? resp.errors : undefined;

    await this.responseHandler(data, respErrors, true);
  }

  private async updateResponseHandler(resp: MutationResult<U>, data: E) {
    const respErrors = resp && resp.errors ? resp.errors : undefined;

    await this.responseHandler(data, respErrors, false);
  }

  private async responseHandler(
    responseData: E | undefined,
    responseErrors: GraphQLErrors | undefined,
    isNew: boolean,
  ) {
    const successMessage = `${this.entityLabel} ${
      isNew ? 'created' : 'updated'
    }`;
    const errorMessage = `Error ${
      isNew ? 'creating' : 'updating'
    } ${this.entityLabel.toLowerCase()}`;

    await this.postResponseHandler({
      responseData,
      responseErrors,
      successMessage,
      errorMessage,
      meta: {
        isNew,
        entityId:
          responseData == null
            ? ''
            : (responseData as unknown as EntityWithId)._id,
        entityRedirectUrl: this.entityRedirectUrl,
        entityKind: this.entityKind,
      },
    });
  }

  private async postResponseHandler(
    data: PageContentEntityFormPostRequestData<E>,
  ) {
    if (data.responseData) {
      await this.postResponseSuccessfulHandler(data);
      return;
    }
    this.actions.dispatch(
      appDisplayErrorMessage({
        message: `${data.errorMessage}, please try again`,
      }),
    );
    this.logger.error(
      data.errorMessage,
      PageContentEntityFormService.name,
      data.responseErrors,
    );
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  private async postResponseSuccessfulHandler(
    data: PageContentEntityFormPostRequestData<E>,
  ) {
    this.actions.dispatch(
      appDisplaySuccessMessage({ message: data.successMessage }),
    );
    const { queryParams } = this.router.parseUrl(this.router.url);
    const { entityRedirectUrl, entityId, entityKind, isNew } = data.meta;

    if (isEmpty(queryParams['parent'])) {
      await this.router.navigate([`/${entityRedirectUrl}`, entityId]);
      return;
    }
    await this.router.navigate(
      [`/${queryParams['parent']}`, queryParams['id'], 'edit'],
      {
        queryParams: {
          id: entityId,
          kind: entityKind,
          ...(isNew && { new: true }),
          ...(queryParams['pageId'] && { pageId: queryParams['pageId'] }),
        },
      },
    );
  }
}
