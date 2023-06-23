import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CodeEditComponent,
  CreateScriptResponse,
  GetScriptResponse,
  Script,
  UpdateScriptResponse,
} from 'shared-lib';
import { PageContentEntityFormComponent } from '../../../layout/page-content-entity-form/page-content-entity-form.component';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { ScriptFormService } from './script-form.service';

@Component({
  selector: 'admin-script-form',
  templateUrl: './script-form.component.html',
  styleUrls: ['./script-form.component.scss'],
  providers: [ScriptFormService],
})
export class ScriptFormComponent extends PageContentEntityFormComponent<
  CreateScriptResponse,
  UpdateScriptResponse,
  GetScriptResponse,
  Script
> {
  @ViewChild(CodeEditComponent) codeEditor: CodeEditComponent | undefined;
  formatted = '';

  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private scriptFormService: ScriptFormService,
  ) {
    super(entityRepo);
    this.formService = this.scriptFormService;
    this.setFormFunction = this.setScriptForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetScript.bind(this);
  }

  codeUpdateHandler($event: string) {
    this.formatted = $event;
    if (this.isEdit) {
      this.enableSaveAndResetButtons();
    }
  }

  private setScriptForm() {
    this.entityForm = this.formBuilder.group(this.getScriptFormGroup());
    this.formatted = this.entity.formatted;
  }

  private resetScript(queryRespData: GetScriptResponse) {
    this.entity = queryRespData.script;
    this.entityForm.setValue({
      name: this.entity.name,
    });
    this.formatted = this.entity.formatted;
    this.codeEditor!.resetCodeEditor(this.formatted);
  }

  private getScriptFormGroup() {
    const defaults = this.getScriptFormDefaultValue();

    return {
      name: [defaults.name, [Validators.required, Validators.minLength(1)]],
    };
  }

  private getScriptFormDefaultValue() {
    return {
      name: this.entity.name,
    };
  }

  private update() {
    this.scriptFormService.updateHandler({
      _id: this.entity._id,
      name: this.entityForm.value.name,
      formatted: this.formatted,
    });
  }

  private create() {
    this.scriptFormService.createHandler({
      name: this.entityForm.value.name,
      formatted: this.formatted,
    });
  }
}
