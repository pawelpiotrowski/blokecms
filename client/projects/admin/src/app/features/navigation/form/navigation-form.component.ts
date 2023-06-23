import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  CreateNavigationResponse,
  GetNavigationResponse,
  Navigation,
  NavigationLink,
  UpdateNavigationResponse,
} from 'shared-lib';
import { PageContentEntityFormComponent } from '../../../layout/page-content-entity-form/page-content-entity-form.component';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { NavigationFormService } from './navigation-form.service';

@Component({
  selector: 'admin-navigation-form',
  templateUrl: './navigation-form.component.html',
  styleUrls: ['./navigation-form.component.scss'],
  providers: [NavigationFormService],
})
export class NavigationFormComponent extends PageContentEntityFormComponent<
  CreateNavigationResponse,
  UpdateNavigationResponse,
  GetNavigationResponse,
  Navigation
> {
  constructor(
    entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private navigationFormService: NavigationFormService,
  ) {
    super(entityRepo);
    this.formService = this.navigationFormService;
    this.setFormFunction = this.setNavigationForm;
    this.createFunction = this.create;
    this.updateFunction = this.update;
    this.resetEntityEditFunction = this.resetNavigation.bind(this);
  }

  linksUpdateHandler(event: NavigationLink[]) {
    this.entity = {
      ...this.entity,
      items: [...event],
    };
    this.entityForm.markAsDirty();
    this.enableSaveAndResetButtons();
  }

  get navigationLinks() {
    return this.entity && this.entity.links ? this.entity.links : [];
  }

  private setNavigationForm() {
    this.entityForm = this.formBuilder.group(this.getNavigationFormGroup());
  }

  private resetNavigation(queryRespData: GetNavigationResponse) {
    this.entity = queryRespData.navigation;
    this.entityForm.setValue({
      name: this.entity.name,
    });
  }

  private getNavigationFormGroup() {
    const defaults = this.getNavigationFormDefaultValue();

    return {
      name: [defaults.name, [Validators.required, Validators.minLength(1)]],
    };
  }

  private getNavigationFormDefaultValue() {
    return {
      name: this.entity.name,
    };
  }

  private update() {
    this.navigationFormService.updateHandler({
      name: this.entityForm.value.name,
      _id: this.entity._id,
      items: this.entity.items,
    });
  }

  private create() {
    this.navigationFormService.createHandler({
      name: this.entityForm.value.name,
      items: [],
    });
  }
}
