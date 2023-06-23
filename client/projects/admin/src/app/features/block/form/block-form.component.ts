import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup } from '@angular/forms';
import { Editor, toHTML, Validators } from 'ngx-editor';
import { filter, pipe, Subscription, take } from 'rxjs';
import { BlockText } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { blockFormEditorToolbar } from './block-form.constants';
import { BlockFormService } from './block-form.service';

@Component({
  selector: 'admin-block-form',
  templateUrl: './block-form.component.html',
  styleUrls: ['./block-form.component.scss'],
  providers: [BlockFormService],
})
export class BlockFormComponent implements OnInit, OnDestroy {
  @Input() blockText!: BlockText;
  isEdit!: boolean;
  editor!: Editor;
  editorForm!: FormGroup;
  editorToolbar = blockFormEditorToolbar;

  private subscriptions = new Subscription();
  private editorJsonDoc = 'null';

  constructor(
    private entityRepo: PageEntityContentRepository,
    private blockFormService: BlockFormService,
  ) {}

  ngOnInit(): void {
    // check create/edit if this is not needed to be set with ngOnChanges
    this.isEdit = this.blockText && this.blockText._id.length > 0;
    this.disableSaveAndResetButtons();
    this.setEditor();
    this.setSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.editor.destroy();
  }

  get editorFormCtrl() {
    return this.editorForm.controls;
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
    this.disableSaveAndResetButtons();
    this.editor.setContent(this.getEditorContentFromData());
  }

  private saveAction() {
    this.disableSaveAndResetButtons();
    if (this.isEdit) {
      this.update();
      return;
    }
    this.create();
  }

  private create() {
    this.blockFormService.createHandler({
      ...this.getBlockPayload(),
      name: this.editorForm.value.name,
    });
  }

  private update() {
    this.blockFormService.updateHandler({
      ...this.getBlockPayload(),
      _id: this.blockText._id,
      name: this.editorForm.value.name,
    });
  }

  private getBlockPayload() {
    return {
      text: this.getEditorFormRawText(),
      jsonDoc: this.editorJsonDoc,
      html: this.getEditorFormRawHtml(),
    };
  }

  private getEditorFormRawText() {
    const editorContentDOMString = new DOMParser().parseFromString(
      this.editorForm.value.editorContent
        .replace(/<p>|<\/p>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      'text/html',
    );
    return editorContentDOMString.body.textContent || '';
  }

  private getEditorFormRawHtml() {
    return this.editorForm.value.editorContent
      .replace(/<p><\/p>/g, '<br>')
      .trim();
  }

  private setEditor() {
    const editorContentInput = this.getEditorContentFromData();
    this.editorForm = new FormGroup({
      name: new FormControl(this.blockText.name, [
        Validators.required(),
        Validators.minLength(1),
      ]),
      editorContent: new FormControl(editorContentInput, Validators.required()),
    });
    this.editor = new Editor({ content: editorContentInput });
  }

  private setSubscriptions() {
    // entity repo subscription
    this.subscriptions.add(
      this.entityRepo.buttonsAction$
        .pipe(this.buttonsActionPipe())
        .subscribe(this.buttonsActionHandler.bind(this)),
    );
    // editor value change subscription
    this.subscriptions.add(
      this.editor.valueChanges.subscribe((doc) => {
        this.editorJsonDoc = JSON.stringify(doc);
      }),
    );
    // editor form validation status subscription
    this.subscriptions.add(
      this.editorForm.statusChanges.subscribe(
        this.editorFormStatusHandler.bind(this),
      ),
    );
  }

  private disableSaveAndResetButtons() {
    this.toggleSaveAndResetButtons(false);
  }

  private toggleSaveAndResetButtons(toggleTo: boolean) {
    this.blockFormService.toggleSaveButton(toggleTo);
    this.blockFormService.toggleResetButton(toggleTo);
  }

  private getEditorContentFromData() {
    return this.isEdit ? toHTML(JSON.parse(this.blockText.jsonDoc)) : '';
  }

  private editorFormStatusHandler(status: FormControlStatus) {
    // is valid
    // and is not edit
    // or it is edit and current value is different from initial one
    const isValid =
      status === 'VALID' &&
      (!this.isEdit || this.editorJsonDoc !== this.blockText.jsonDoc);
    this.toggleSaveAndResetButtons(isValid);
  }
}
