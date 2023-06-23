import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, pipe, Subscription } from 'rxjs';
import { Article, ArticleContent, isEmpty } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { ArticleFormService } from './article-form.service';

@Component({
  selector: 'admin-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormService],
})
export class ArticleFormComponent implements OnInit, OnDestroy {
  @Input() article!: Article;
  isEdit!: boolean;
  // page id for handling redirection to page after editing
  pageId: string | null = null;
  articleForm!: FormGroup;
  expandContent = false;

  private subscriptions = new Subscription();

  constructor(
    private entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private articleFormService: ArticleFormService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // check create/edit if this is not needed to be set with ngOnChanges
    this.isEdit = this.article && this.article._id.length > 0;
    this.disableSaveAndResetButtons();
    this.setArticleForm();
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  articleFormSubmit(event: Event) {
    event.preventDefault();
    if (!this.canSubmitArticleForm) {
      return;
    }
    this.saveAction();
  }

  onContentUpdate($event: ArticleContent[]) {
    this.article = {
      ...this.article,
      content: $event,
    };
    this.enableSaveAndResetButtons();
  }

  onSearchResult($event: ArticleContent[]) {
    if ($event.length < 1) {
      return;
    }
    this.onContentUpdate([
      ...$event,
      ...(this.article.content as ArticleContent[]),
    ]);
  }

  get canSubmitArticleForm() {
    return (
      (this.articleForm &&
        this.articleForm.status &&
        this.articleForm.status === 'VALID') ||
      false
    );
  }

  get articleFormCtrl() {
    return this.articleForm.controls;
  }

  get articleContent() {
    return this.article && this.article.content ? this.article.content : [];
  }

  private disableSaveAndResetButtons() {
    this.articleFormService.toggleSaveButton(false);
    this.articleFormService.toggleResetButton(false);
  }

  private enableSaveAndResetButtons() {
    this.articleFormService.toggleSaveButton(true);
    this.articleFormService.toggleResetButton(true);
  }

  private setArticleForm() {
    this.articleForm = this.formBuilder.group(this.getArticleFormGroup());
  }

  private getArticleFormGroup() {
    const defaults = this.getArticleFormDefaultValue();

    return {
      title: [defaults.title, [Validators.required, Validators.minLength(1)]],
    };
  }

  private getArticleFormDefaultValue() {
    return {
      title: this.article.title,
    };
  }

  private setSubscriptions() {
    // entity repo subscription
    this.subscriptions.add(
      this.entityRepo.buttonsAction$
        .pipe(this.buttonsActionPipe())
        .subscribe(this.buttonsActionHandler.bind(this)),
    );
    // article value change subscription
    this.subscriptions.add(
      this.articleForm.valueChanges.subscribe(
        this.articleFormValueChangeHandler.bind(this),
      ),
    );
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
    // always reset pageId when query params are changed
    this.pageId = null;

    // no params -> return early
    if (isEmpty(params)) {
      return;
    }

    // Here article is either edited or created from page -> set `pageId` and return early
    if (!isEmpty(params['parent']) && params['parent'] === 'pages') {
      this.pageId = params['id'];
      return;
    }
    // Returning to article after block/multimedia edit -> clean up query
    if (isEmpty(params['new'])) {
      await this.queryParamsCleanHandler(params);
      return;
    }
    // Returning after new block/multimedia has been added
    this.queryParamsItemAddedHandler(params);
  }

  private async queryParamsCleanHandler(params: Params) {
    // this is checking if editing journey started with page
    if (!isEmpty(params['pageId'])) {
      // editing journey started with page so we need to preserve parent
      // and return early
      await this.articleFormService.cleanQueryParams(this.article._id, {
        parent: 'pages',
        id: params['pageId'],
      });
      return;
    }
    // editing journey started with article -> clean up query
    await this.articleFormService.cleanQueryParams(this.article._id);
  }

  private queryParamsItemAddedHandler(params: Params) {
    const content = [...(this.article.content as ArticleContent[])];
    content.unshift({
      refId: params['id'],
      kind: params['kind'].charAt(0).toUpperCase() + params['kind'].slice(1),
    });

    this.articleFormService
      .getUpdateHandler({
        title: this.articleForm.value.title,
        _id: this.article._id,
        content,
      })
      .subscribe(async () => {
        await this.queryParamsCleanHandler(params);
        this.resetAction();
      });
  }

  private articleFormValueChangeHandler() {
    this.articleFormService.toggleResetButton(this.articleForm.dirty);
    this.articleFormService.toggleSaveButton(
      this.articleForm.dirty && this.articleForm.status === 'VALID',
    );
  }

  private buttonsActionPipe() {
    return pipe(
      filter<PageContentEntityToolbarButtonAction>(
        (buttonAction) =>
          buttonAction === PageContentEntityToolbarButtons.Save ||
          buttonAction === PageContentEntityToolbarButtons.Reset,
      ),
    );
  }

  private buttonsActionHandler(action: PageContentEntityToolbarButtonAction) {
    if (action === PageContentEntityToolbarButtons.Reset) {
      this.resetAction();
      return;
    }
    this.saveAction();
  }

  private resetAction() {
    this.articleFormService
      .getLastSave(this.article._id)
      .subscribe((queryResp) => {
        this.article = queryResp.data.article;
      });
    this.disableSaveAndResetButtons();
  }

  private saveAction() {
    this.disableSaveAndResetButtons();
    if (this.isEdit) {
      this.update();
      return;
    }
    this.create();
  }

  private update() {
    this.articleFormService.updateHandler({
      title: this.articleForm.value.title,
      _id: this.article._id,
      content: this.article.content,
    });
  }

  private create() {
    this.articleFormService.createHandler({
      title: this.articleForm.value.title,
      content: [],
    });
  }
}
