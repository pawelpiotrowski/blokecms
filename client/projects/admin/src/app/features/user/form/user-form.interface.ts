import { GraphQLErrors } from '@apollo/client/errors';
import { User } from 'shared-lib';

export interface UserFormPostUserRequestDto {
  userResponseData: User | undefined;
  userResponseErrors: GraphQLErrors | undefined;
  successMessage: string;
  errorMessage: string;
}

export interface UserFormValue {
  username: string;
  isAdmin: boolean;
  password: string;
  confirmPassword: string;
}
