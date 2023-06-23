import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageFormAutocompleteSelect } from '../../../page/form/autocomplete/page-form-autocomplete.component';
import { NavigationFormLink } from '../navigation-form.interface';

@Component({
  selector: 'admin-navigation-form-link',
  templateUrl: './navigation-form-link.component.html',
  styleUrls: ['./navigation-form-link.component.scss'],
})
export class NavigationFormLinkComponent implements OnChanges, OnInit {
  @Input() link!: NavigationFormLink;
  @Input() activated!: boolean;
  @Output() linkUpdate = new EventEmitter<NavigationFormLink>();

  isEdit!: boolean;
  linkForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['activated'] &&
      !changes['activated'].firstChange &&
      this.linkForm.dirty &&
      this.activated === false
    ) {
      this.setLinkForm();
    }
  }

  ngOnInit() {
    this.isEdit =
      this.link != null &&
      typeof this.link.index === 'number' &&
      this.link.index > -1;
    this.setLinkForm();
  }

  linkFormSubmit(event: Event) {
    event.preventDefault();
    this.save();
  }

  save() {
    if (!this.canSubmitLinkForm) {
      return;
    }
    this.linkUpdate.emit({
      label: this.linkForm.value.label,
      index: this.link.index,
      ...(this.isExternal && { url: this.linkForm.value.url }),
      ...(!this.isExternal && { pageId: this.link.pageId }),
      ...(!this.isExternal && { slug: this.link.slug }),
    });
  }

  internalLinkPageUpdate(event: PageFormAutocompleteSelect) {
    this.link.pageId = event._id;
    this.link.slug = event.slug;
  }

  get asPage(): PageFormAutocompleteSelect | null {
    if (this.isExternal || this.link == null) {
      return null;
    }
    const { pageId, slug } = this.link;

    return {
      _id: pageId as string,
      slug: slug as string,
    };
  }

  get linkFormCtrl() {
    return this.linkForm.controls;
  }

  get isExternal() {
    return this.link != null && this.link.url != null;
  }

  get canSubmitLinkForm() {
    return this.isExternal
      ? this.canSubmitExternalLinkForm
      : this.canSubmitInternalLinkForm;
  }

  private get canSubmitExternalLinkForm() {
    return (
      (this.linkForm != null &&
        this.linkForm.status === 'VALID' &&
        this.linkForm.dirty) ||
      false
    );
  }

  private get canSubmitInternalLinkForm() {
    return (
      this.canSubmitExternalLinkForm &&
      typeof this.link.pageId === 'string' &&
      this.link.pageId.length > 0 &&
      typeof this.link.slug === 'string' &&
      this.link.slug.length > 0
    );
  }

  private setLinkForm() {
    this.linkForm = this.formBuilder.group(this.getLinkFormGroup());
  }

  private getLinkFormGroup() {
    const defaults = this.getLinkFormDefaultValue();

    return {
      label: [defaults.label, [Validators.required, Validators.minLength(1)]],
      ...(this.isExternal && {
        url: [defaults.url, [Validators.required, Validators.minLength(1)]],
      }),
    };
  }

  private getLinkFormDefaultValue() {
    return {
      label: this.link != null ? this.link.label : '',
      ...(this.isExternal && { url: this.link.url }),
    };
  }
}
