import { GraphQLErrors } from '@apollo/client/errors';

export interface PageContentEntityFormPostRequestMetadata {
  isNew: boolean;
  entityId: string;
  entityRedirectUrl: string;
  entityKind: string;
}

export interface PageContentEntityFormPostRequestData<T> {
  responseData: T | undefined;
  responseErrors: GraphQLErrors | undefined;
  successMessage: string;
  errorMessage: string;
  meta: PageContentEntityFormPostRequestMetadata;
}

export interface EntityWithId {
  _id: string;
  [key: string]: any;
}
