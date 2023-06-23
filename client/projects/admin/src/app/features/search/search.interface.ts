import { Query } from 'apollo-angular';

export const searchDialogSize = {
  height: '90vh',
  width: '92vw',
  maxWidth: '92vw',
};
export type SearchDataQueryReference<Q, R> = (d: Q) => R[];
export type SearchDataIsSelected<C, R> = (r: R, ra: R[], c: C[]) => boolean;
export type SearchDataRemoveItem<R> = (r: R, ra: R[]) => R[];
export type SelectedResultAsContent<R, T> = (
  ra: R[],
) => SelectedResultContent<T>[];
export type SearchDataQueryInput = (q: string) => { [key: string]: string };
export type SelectedResult<R> = (ra: R[]) => R[];
export interface SelectedResultContent<T> {
  refId: string;
  kind: T;
  __typename: string;
}

export interface SearchData<C, Q, R, T> {
  content: C[];
  service: Query<Q>;
  dataQueryRef: SearchDataQueryReference<Q, R>;
  isSelected: SearchDataIsSelected<C, R>;
  removeItem: SearchDataRemoveItem<R>;
  inputPlaceholder: string;
  inputLabel: string;
  resultItemDisplay: (r: R) => string;
  getResultAsContent?: SelectedResultAsContent<R, T>;
  getResult?: SelectedResult<R>;
  getQueryInput: SearchDataQueryInput;
}
