import { InferSubjects } from '@casl/ability';
import { User } from '../user/user.schema';
import { Page } from '../page/page.schema';
import { Block } from '../block/block.schema';
import { Article } from '../article/article.schema';
import { Navigation } from '../settings/navigation/navigation.schema';
import { Style } from '../settings/style/style.schema';

export enum CaslAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type CaslSubjects =
  | InferSubjects<
      | typeof Page
      | typeof User
      | typeof Block
      | typeof Article
      | typeof Navigation
      | typeof Style
    >
  | 'all';
