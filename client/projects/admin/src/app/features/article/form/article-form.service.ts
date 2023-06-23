import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import {
  Article,
  CreateArticleGQL,
  CreateArticleInput,
  CreateArticleResponse,
  GetArticleGQL,
  GetArticleResponse,
  GetArticlesGQL,
  isEmpty,
  UpdateArticleGQL,
  UpdateArticleInput,
  UpdateArticleResponse,
} from 'shared-lib';
import { PageContentEntityFormService } from '../../../layout/page-content-entity-form/page-content-entity-form.service';

@Injectable()
export class ArticleFormService extends PageContentEntityFormService<
  CreateArticleResponse,
  UpdateArticleResponse,
  GetArticleResponse,
  Article
> {
  constructor(
    getArticles: GetArticlesGQL,
    createArticle: CreateArticleGQL,
    updateArticle: UpdateArticleGQL,
    getArticle: GetArticleGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getArticles.document;
    this.entityCreateMutation = createArticle;
    this.entityUpdateMutation = updateArticle;
    this.entityQuery = getArticle;
    this.entityLabel = 'Article';
    this.entityRedirectUrl = 'articles';
    this.entityKind = 'article';
  }

  createHandler(input: CreateArticleInput) {
    this.create<CreateArticleInput>(input, this.postCreateDataMapping);
  }

  updateHandler(input: UpdateArticleInput) {
    this.update<UpdateArticleInput>(input, this.postUpdateDataMapping);
  }

  getUpdateHandler(input: UpdateArticleInput) {
    return this.updateMutation(input);
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  override async cleanQueryParams(id: string, queryParams?: Params) {
    await this.router.navigate([`/${this.entityRedirectUrl}`, id, 'edit'], {
      replaceUrl: true,
      ...(!isEmpty(queryParams) && { queryParams }),
    });
  }

  private postCreateDataMapping(resp: MutationResult<CreateArticleResponse>) {
    return resp && resp.data && resp.data.createArticle
      ? resp.data.createArticle
      : undefined;
  }

  private postUpdateDataMapping(resp: MutationResult<UpdateArticleResponse>) {
    return resp && resp.data && resp.data.updateArticle
      ? resp.data.updateArticle
      : undefined;
  }
}
