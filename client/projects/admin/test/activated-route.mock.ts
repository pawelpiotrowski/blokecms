import clone from 'just-clone';
import { of } from 'rxjs';

export const pageWithChildDrawerActivatedRouteMock = {
  snapshot: {
    params: {
      id: '24fkzrw3487943uf358lovd',
    },
    parent: {
      data: {
        title: 'Parent Title',
      },
      parent: {
        routeConfig: {
          path: 'parent',
        },
      },
    },
    url: [],
  },
  params: of({}),
};

export type PageWithChildDrawerActivatedRouteMock =
  typeof pageWithChildDrawerActivatedRouteMock;

export const getPageWithChildDrawerActivatedRouteMockClone = () =>
  clone(pageWithChildDrawerActivatedRouteMock);
