import { GraphQLErrors } from '@apollo/client/errors';
import { BlockMedia } from 'shared-lib';

export interface MediaFormPostRequestDto {
  blockMediaResponseData: BlockMedia | undefined;
  blockMediaResponseErrors: GraphQLErrors | undefined;
  successMessage: string;
  errorMessage: string;
}
