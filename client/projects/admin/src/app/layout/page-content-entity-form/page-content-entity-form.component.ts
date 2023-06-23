import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, pipe, Subscription } from 'rxjs';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../page-content-entity-layout/page-entity-content.repository';
import { EntityWithId } from './page-content-entity-form.interface';
import { PageContentEntityFormService } from './page-content-entity-form.service';

@Component({ template: '' })
export abstract class PageContentEntityFormComponent<C, U, G, E>
  implements OnInit, OnDestroy
{
  @Input() entity!: E;
  isEdit!: boolean;
  formService!: PageContentEntityFormService<C, U, G, E>;
  entityForm!: FormGroup;
  expandContent = false;

  protected subscriptions = new Subscription();
  protected setFormFunction!: () => void;
  protected createFunction!: () => void;
  protected updateFunction!: () => void;
  protected resetEntityEditFunction!: (resp: G) => void;
  protected postOnInitFunction!: () => void;

  constructor(private entityRepo: PageEntityContentRepository) {}

  ngOnInit(): void {
    this.isEdit = this.entity && this.entityId.length > 0;
    this.disableSaveAndResetButtons();
    this.setFormFunction();
    this.setSubscriptions();
    if (typeof this.postOnInitFunction === 'function') {
      this.postOnInitFunction();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  entityFormSubmit(event: Event) {
    event.preventDefault();
    if (!this.canSubmitEntityForm) {
      return;
    }
    this.saveAction();
  }

  get entityFormCtrl() {
    return this.entityForm.controls;
  }

  protected disableSaveAndResetButtons() {
    this.formService.toggleSaveButton(false);
    this.formService.toggleResetButton(false);
  }

  protected enableSaveAndResetButtons() {
    this.formService.toggleSaveButton(true);
    this.formService.toggleResetButton(true);
  }

  protected resetAction() {
    this.disableSaveAndResetButtons();
    if (!this.isEdit) {
      this.entityForm.reset();
      return;
    }
    this.formService.getLastSave(this.entityId).subscribe((queryResp) => {
      this.resetEntityEditFunction(queryResp.data);
    });
  }

  private setSubscriptions() {
    // entity repo subscription
    this.subscriptions.add(
      this.entityRepo.buttonsAction$
        .pipe(this.buttonsActionPipe())
        .subscribe(this.buttonsActionHandler.bind(this)),
    );
    // entity value change subscription
    this.subscriptions.add(
      this.entityForm.valueChanges.subscribe(
        this.entityFormValueChangeHandler.bind(this),
      ),
    );
  }

  private entityFormValueChangeHandler() {
    this.formService.toggleResetButton(this.entityForm.dirty);
    this.formService.toggleSaveButton(
      this.entityForm.dirty && this.entityForm.status === 'VALID',
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

  private saveAction() {
    this.disableSaveAndResetButtons();
    if (this.isEdit) {
      this.updateFunction();
      return;
    }
    this.createFunction();
  }

  private get entityId() {
    return (this.entity as EntityWithId)._id;
  }

  private get canSubmitEntityForm() {
    return (
      (this.entityForm &&
        this.entityForm.status &&
        this.entityForm.status === 'VALID') ||
      false
    );
  }
}
