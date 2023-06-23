import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Article,
  Page,
  isEmpty,
  CreatePageResponse,
  UpdatePageResponse,
  GetPageResponse,
} from 'shared-lib';
import { PageContentEntityFormComponent } from '../../../layout/page-content-entity-form/page-content-entity-form.component';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { PageFormService } from './page-form.service';

@Component({
  selector: 'admin-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
  providers: [PageFormService],
})
export class PageFormComponent extends PageContentEntityFormComponent<
  CreatePageResponse,
  UpdatePageResponse,
  GetPageResponse,
  Page
> {
  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private pageFormService: PageFormService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(entityRepo);
    this.formService = this.pageFormService;
    this.setFormFunction = this.setPageForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetNavigation.bind(this);
    this.postOnInitFunction = this.setPostInitSubscriptions;
  }

  onArticlesUpdate($event: Article[]) {
    this.entity = {
      ...this.entity,
      articles: $event,
    };
    this.enableSaveAndResetButtons();
  }

  onSearchResult($event: Article[]) {
    if ($event.length < 1) {
      return;
    }
    this.onArticlesUpdate([...$event, ...(this.entity.articles as Article[])]);
  }

  get pageArticles() {
    return this.entity && this.entity.articles ? this.entity.articles : [];
  }

  private setPageForm() {
    this.entityForm = this.formBuilder.group(this.getPageFormGroup());
  }

  private getPageFormGroup() {
    const defaults = this.getPageFormDefaultValue();

    return {
      title: [defaults.title, [Validators.required, Validators.minLength(1)]],
      slug: [defaults.slug, [Validators.required, Validators.minLength(1)]],
    };
  }

  private getPageFormDefaultValue() {
    return {
      slug: this.entity.slug,
      title: this.entity.title,
    };
  }

  private resetNavigation(queryRespData: GetPageResponse) {
    this.entity = queryRespData.page;
    this.entityForm.setValue({
      title: this.entity.title,
      slug: this.entity.slug,
    });
  }

  private setPostInitSubscriptions() {
    // query params subscription
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(
        this.queryParamsHandler.bind(this),
      ),
    );
  }

  /**
   * See: client/admin/README.md -> Query Params Handling in Edit/Create Views
   */
  private async queryParamsHandler(params: Params) {
    // return early if params is empty
    if (isEmpty(params)) {
      return;
    }
    // when returning after edit just clean query params and return early
    if (isEmpty(params['new'])) {
      await this.pageFormService.cleanQueryParams(this.entity._id);
      return;
    }
    // when returning after adding new article
    // add new article id to articles
    // and then clean query params
    const articles = [...(this.entity.articles as Article[])].map(
      (article) => article._id,
    );

    articles.unshift(params['id']);

    this.pageFormService
      .getUpdateHandler({
        title: this.entityForm.value.title,
        slug: this.entityForm.value.slug,
        _id: this.entity._id,
        articles,
      })
      .subscribe(async () => {
        await this.pageFormService.cleanQueryParams(this.entity._id);
        this.resetAction();
      });
  }

  private update() {
    this.pageFormService.updateHandler({
      title: this.entityForm.value.title,
      slug: this.entityForm.value.slug,
      _id: this.entity._id,
      articles: this.entity.articles?.map((article) => article._id),
    });
  }

  private create() {
    this.pageFormService.createHandler({
      title: this.entityForm.value.title,
      slug: this.entityForm.value.slug,
    });
  }
}
