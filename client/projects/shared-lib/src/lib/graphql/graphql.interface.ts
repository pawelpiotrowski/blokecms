import { InjectionToken } from '@angular/core';
import { GraphQLErrors } from '@apollo/client/errors';

export interface GqlModuleConfig {
  useAbsoluteUrl: boolean;
}

export const gqlConfig = new InjectionToken<GqlModuleConfig>('gqlConfig');

export interface GqlPostRequestDto<T> {
  responseData: T | undefined;
  responseErrors: GraphQLErrors | undefined;
  successMessage: string;
  errorMessage: string;
}
