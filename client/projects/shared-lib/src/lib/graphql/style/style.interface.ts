import { EmptyObject } from 'apollo-angular/types';

interface StyleBase {
  _id: string;
  name: string;
}

export interface Style extends StyleBase {
  formatted: string;
}

export interface StyleMinified extends StyleBase {
  minified: string;
}

export interface AllStylesResponse {
  styles: Style[];
}

export interface GetStyleResponse {
  style: Style;
}

export interface GetStyleMinifiedResponse {
  style: StyleMinified;
}

export interface CreateStyleResponse {
  createStyle: Style;
}

export interface UpdateStyleResponse {
  updateStyle: Style;
}

export type CreateStyleInput = Omit<Style, '_id'>;

export type DeleteStyleResponse = EmptyObject;

export interface UpdateStyleInput extends Omit<StyleBase, 'name'> {
  name?: string;
  formatted?: string;
}
