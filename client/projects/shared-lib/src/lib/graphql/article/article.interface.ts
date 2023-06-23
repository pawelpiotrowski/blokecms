import { EmptyObject } from 'apollo-angular/types';

interface ArticleBase {
  title: string;
  content?: ArticleContent[];
}

export interface ArticleContent {
  refId: string;
  kind: 'text' | 'media' | 'code';
}

export interface Article extends ArticleBase {
  _id: string;
  authorId?: string;
}

export interface AllArticlesResponse {
  articles: Article[];
}

export interface AllArticlesCountResponse {
  articlesCount: number;
}

export interface GetArticleResponse {
  article: Article;
}

export interface CreateArticleResponse {
  createArticle: Article;
}

export interface UpdateArticleResponse {
  updateArticle: Article;
}

export type CreateArticleInput = ArticleBase;

export type DeleteArticleResponse = EmptyObject;

export interface UpdateArticleInput
  extends Omit<Article, 'title' | 'authorId'> {
  title?: string;
}

export interface GetArticlesByTitleResponse {
  findArticlesByTitle: [Article];
}
