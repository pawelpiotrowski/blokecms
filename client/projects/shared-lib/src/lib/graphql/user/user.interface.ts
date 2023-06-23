import { EmptyObject } from 'apollo-angular/types';

export interface User {
  _id: string;
  username: string;
  isAdmin?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AllUsersResponse {
  users: User[];
}

export interface GetUserResponse {
  user: User;
}

export interface CreateUserResponse {
  createUser: User;
}

export interface UpdateUserResponse {
  updateUser: User;
}

export interface CreateUserInput {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface UpdateUserInput {
  _id: string;
  isAdmin?: boolean;
  username?: string;
  password?: string;
}

export type DeleteUserResponse = EmptyObject;
