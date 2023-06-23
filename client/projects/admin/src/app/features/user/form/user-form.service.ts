import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  CreateUserGQL,
  CreateUserResponse,
  GetUsersGQL,
  GetUserGQL,
  GetUserResponse,
  UpdateUserGQL,
  UpdateUserInput,
  UpdateUserResponse,
  User,
  CreateUserInput,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';
import { UserFormValue } from './user-form.interface';

@Injectable()
export class UserFormService extends PageContentEntityFormService<
  CreateUserResponse,
  UpdateUserResponse,
  GetUserResponse,
  User
> {
  constructor(
    createUser: CreateUserGQL,
    updateUser: UpdateUserGQL,
    getUsers: GetUsersGQL,
    getUser: GetUserGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getUsers.document;
    this.entityCreateMutation = createUser;
    this.entityUpdateMutation = updateUser;
    this.entityQuery = getUser;
    this.entityLabel = 'User';
    this.entityRedirectUrl = 'users';
    this.entityKind = '';
  }

  createUserHandler(userFormValue: UserFormValue) {
    const { confirmPassword, ...input } = userFormValue;

    this.create<CreateUserInput>(
      input as CreateUserInput,
      this.postCreateDataMapping,
    );
  }

  updateUserHandler(userFormValue: UserFormValue, userId: string) {
    const { password, username, isAdmin } = userFormValue;
    const input: UpdateUserInput = {
      _id: userId,
      username,
      isAdmin,
    };
    if (password && password.length) {
      input.password = password;
    }

    this.update<UpdateUserInput>(input, this.postUpdateDataMapping);
  }

  private postCreateDataMapping(resp: MutationResult<CreateUserResponse>) {
    return resp && resp.data && resp.data.createUser
      ? resp.data.createUser
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateUserResponse>) {
    return resp && resp.data && resp.data.updateUser
      ? resp.data.updateUser
      : undefined;
  }
}
