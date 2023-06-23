import { EmptyObject } from 'apollo-angular/types';

interface NavigationBase {
  name: string;
  links?: NavigationLink[];
  items?: NavigationLink[];
}

export interface NavigationLink {
  label: string;
  pageId?: string;
  slug?: string;
  url?: string;
}

export interface Navigation extends NavigationBase {
  _id: string;
  authorId?: string;
}

export interface AllNavigationsResponse {
  navigations: Navigation[];
}

export interface GetNavigationResponse {
  navigation: Navigation;
}

export interface CreateNavigationResponse {
  createNavigation: Navigation;
}

export interface UpdateNavigationResponse {
  updateNavigation: Navigation;
}

export type CreateNavigationInput = NavigationBase;

export type DeleteNavigationResponse = EmptyObject;

export interface UpdateNavigationInput
  extends Omit<Navigation, 'name' | 'authorId'> {
  name?: string;
}
