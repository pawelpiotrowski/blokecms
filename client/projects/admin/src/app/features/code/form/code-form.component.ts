import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BlockCode,
  CodeEditComponent,
  codeEditLanguages,
  CreateBlockCodeResponse,
  GetBlockCodeResponse,
  UpdateBlockCodeResponse,
} from 'shared-lib';
import { PageContentEntityFormComponent } from '../../../layout/page-content-entity-form/page-content-entity-form.component';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { CodeFormService } from './code-form.service';

@Component({
  selector: 'admin-code-form',
  templateUrl: './code-form.component.html',
  styleUrls: ['./code-form.component.scss'],
  providers: [CodeFormService],
})
export class CodeFormComponent extends PageContentEntityFormComponent<
  CreateBlockCodeResponse,
  UpdateBlockCodeResponse,
  GetBlockCodeResponse,
  BlockCode
> {
  @ViewChild(CodeEditComponent) codeEditor: CodeEditComponent | undefined;
  languages = codeEditLanguages;
  code = '';

  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private codeFormService: CodeFormService,
  ) {
    super(entityRepo);
    this.formService = this.codeFormService;
    this.setFormFunction = this.setCodeForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetCode.bind(this);
  }

  codeUpdateHandler($event: string) {
    this.code = $event;
    if (this.isEdit) {
      this.enableSaveAndResetButtons();
    }
  }

  get codeFormLang() {
    return this.entityFormCtrl['lang'].value as string;
  }

  get codeFormShowLineNumbers() {
    return this.entityFormCtrl['showLineNumbers'].value as boolean;
  }

  private setCodeForm() {
    this.entityForm = this.formBuilder.group(this.getCodeFormGroup());
    this.code = this.entity.code;
  }

  private resetCode(queryRespData: GetBlockCodeResponse) {
    this.entity = queryRespData.blockCode;
    this.entityForm.setValue(this.getCodeFormDefaultValue());
    this.code = this.entity.code;
    this.codeEditor!.resetCodeEditor(this.code);
  }

  private getCodeFormGroup() {
    const defaults = this.getCodeFormDefaultValue();

    return {
      name: [defaults.name, [Validators.required, Validators.minLength(1)]],
      showLineNumbers: [defaults.showLineNumbers, [Validators.required]],
      lang: [defaults.lang, [Validators.required]],
    };
  }

  private getCodeFormDefaultValue() {
    return {
      name: this.entity.name,
      showLineNumbers: this.entity.showLineNumbers,
      lang: this.entity.lang,
    };
  }

  private update() {
    this.codeFormService.updateHandler({
      name: this.entityForm.value.name,
      _id: this.entity._id,
      showLineNumbers: this.entityForm.value.showLineNumbers,
      lang: this.entityForm.value.lang,
      code: this.code,
    });
  }

  private create() {
    this.codeFormService.createHandler({
      name: this.entityForm.value.name,
      showLineNumbers: this.entityForm.value.showLineNumbers,
      lang: this.entityForm.value.lang,
      code: this.code,
    });
  }
}
