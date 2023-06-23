import { EmptyObject } from 'apollo-angular/types';
import { Article } from '../article';
import { BlockCode, BlockMedia, BlockText } from '../block';

export const pageSlugRegex = /^[A-Za-z0-9_\/-]*$/;

interface PageBase {
  slug: string;
  title: string;
  articles?: Article[];
}

export interface Page extends PageBase {
  _id: string;
  authorId?: string;
}

export interface AllPagesResponse {
  pages: Page[];
}

export interface AllPagesCountResponse {
  pagesCount: number;
}

export interface GetPageResponse {
  page: Page;
}

export interface CreatePageResponse {
  createPage: Page;
}

export interface UpdatePageResponse {
  updatePage: Page;
}

export type CreatePageInput = Omit<Page, 'authorId' | 'articles' | '_id'>;

export type DeletePageResponse = EmptyObject;

export interface UpdatePageInput
  extends Omit<Page, 'title' | 'authorId' | 'slug' | 'articles'> {
  title?: string;
  slug?: string;
  articles?: string[];
}

export interface GetPagesByTitleOrSlugResponse {
  findPagesByTitleOrSlug: [Page];
}

export interface PageArticlePublic
  extends Omit<Article, 'authorId' | 'content'> {
  blocks: Array<BlockMedia | BlockText | BlockCode>;
}

export interface PagePublic extends Omit<Page, 'authorId' | 'articles'> {
  articles: PageArticlePublic[];
}

export interface GetPagePublicResponse {
  page: PagePublic;
}
