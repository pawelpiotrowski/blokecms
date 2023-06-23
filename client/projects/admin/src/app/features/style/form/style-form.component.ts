import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CodeEditComponent,
  CreateStyleResponse,
  GetStyleResponse,
  Style,
  UpdateStyleResponse,
} from 'shared-lib';
import { PageContentEntityFormComponent } from '../../../layout/page-content-entity-form/page-content-entity-form.component';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { StyleFormService } from './style-form.service';

@Component({
  selector: 'admin-style-form',
  templateUrl: './style-form.component.html',
  styleUrls: ['./style-form.component.scss'],
  providers: [StyleFormService],
})
export class StyleFormComponent extends PageContentEntityFormComponent<
  CreateStyleResponse,
  UpdateStyleResponse,
  GetStyleResponse,
  Style
> {
  @ViewChild(CodeEditComponent) codeEditor: CodeEditComponent | undefined;
  formatted = '';

  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private styleFormService: StyleFormService,
  ) {
    super(entityRepo);
    this.formService = this.styleFormService;
    this.setFormFunction = this.setStyleForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetStyle.bind(this);
  }

  codeUpdateHandler($event: string) {
    this.formatted = $event;
    if (this.isEdit) {
      this.enableSaveAndResetButtons();
    }
  }

  private setStyleForm() {
    this.entityForm = this.formBuilder.group(this.getStyleFormGroup());
    this.formatted = this.entity.formatted;
  }

  private resetStyle(queryRespData: GetStyleResponse) {
    this.entity = queryRespData.style;
    this.entityForm.setValue({
      name: this.entity.name,
    });
    this.formatted = this.entity.formatted;
    this.codeEditor!.resetCodeEditor(this.formatted);
  }

  private getStyleFormGroup() {
    const defaults = this.getStyleFormDefaultValue();

    return {
      name: [defaults.name, [Validators.required, Validators.minLength(1)]],
    };
  }

  private getStyleFormDefaultValue() {
    return {
      name: this.entity.name,
    };
  }

  private update() {
    this.styleFormService.updateHandler({
      _id: this.entity._id,
      name: this.entityForm.value.name,
      formatted: this.formatted,
    });
  }

  private create() {
    this.styleFormService.createHandler({
      name: this.entityForm.value.name,
      formatted: this.formatted,
    });
  }
}
