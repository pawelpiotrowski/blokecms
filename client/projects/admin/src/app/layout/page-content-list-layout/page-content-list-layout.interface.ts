export interface PageContentListColumn {
  columnDef: string;
  header: string;
  cell: (arg?: PageContentListRow) => string | null;
  type?: PageContentListColumnType;
}

export type PageContentListColumnType = 'date' | 'string';

export enum PageContentListColumnAction {
  view = '-view',
  edit = '-edit',
  delete = '-delete',
}

export interface PageContentListRow {
  [key: string]: any;
}
