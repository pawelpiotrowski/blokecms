export enum PageContentEntityToolbarButtons {
  Back = 'Back',
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  Reset = 'Reset',
  Save = 'Save',
}

export type PageContentEntityToolbarButtonsAvailability = {
  [key in PageContentEntityToolbarButtons]: boolean;
};

/**
 * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
 */
export interface PageContentEntityQueryParams {
  pageId?: string;
  parent?: 'articles' | 'pages';
  id?: string;
  new?: true;
  kind?: 'text' | 'media' | 'article';
}

export interface PageContentEntityBackButtonSubject {
  route: string[];
  query: PageContentEntityQueryParams | null;
  label: string;
}

export const pageContentEntityToolbarButtonsAvailabilityDefault: PageContentEntityToolbarButtonsAvailability =
  {
    Back: true,
    Create: true,
    Edit: true,
    Delete: true,
    Save: true,
    Reset: true,
  };

export type PageContentEntityToolbarButtonAction =
  PageContentEntityToolbarButtons | null;
export interface PageEntityContentProps {
  buttonsAvailability: PageContentEntityToolbarButtonsAvailability;
  buttonsAction: PageContentEntityToolbarButtonAction;
}
