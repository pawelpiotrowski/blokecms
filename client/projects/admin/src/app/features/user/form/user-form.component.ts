import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { filter, pipe, Subscription } from 'rxjs';
import { User } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { UserFormValue } from './user-form.interface';
import { UserFormService } from './user-form.service';

@Component({
  selector: 'admin-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [UserFormService],
})
export class UserFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user!: User;
  isEdit!: boolean;
  createUserForm!: FormGroup;
  createUserPwdInputsHide = true;
  createUserProcessing = false;
  private entityRepoSubscription!: Subscription;

  constructor(
    private entityRepo: PageEntityContentRepository,
    private formBuilder: FormBuilder,
    private userFormService: UserFormService,
  ) {}

  ngOnInit() {
    this.userFormService.toggleSaveButton(false);
    this.userFormService.toggleResetButton(false);
    this.entityRepoSubscription = this.entityRepo.buttonsAction$
      .pipe(this.buttonsActionPipe())
      .subscribe(this.buttonsActionHandler.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue != null) {
      this.setUserForm();
    }
  }

  ngOnDestroy() {
    this.entityRepoSubscription.unsubscribe();
  }

  toggleCreateUserPwdInputsHide() {
    this.createUserPwdInputsHide = !this.createUserPwdInputsHide;
  }

  onCreateUserSubmit(event: Event) {
    event.preventDefault();
    if (!this.canSubmitCreateUser) {
      return;
    }
    this.saveAction();
  }

  get canSubmitCreateUser() {
    return (
      (!this.createUserProcessing &&
        this.createUserForm &&
        this.createUserForm.status &&
        this.createUserForm.status === 'VALID') ||
      false
    );
  }

  get createUserFormCtrl() {
    return this.createUserForm.controls;
  }

  private setUserForm() {
    this.isEdit = this.user && this.user._id.length > 0;
    this.createUserForm = this.formBuilder.group(this.getUserFormGroup());
    this.createUserForm.valueChanges.subscribe(
      this.createUserFormValueChangeHandler.bind(this),
    );
  }

  private getUserFormGroup() {
    const passwordValidators = [
      ...(this.isEdit ? [] : [Validators.required, Validators.minLength(1)]),
    ];
    const defaults = this.getDefaultUserFormValue();

    return {
      username: [
        defaults.username,
        [Validators.required, Validators.minLength(1)],
      ],
      isAdmin: defaults.isAdmin,
      password: [defaults.password, [...passwordValidators]],
      confirmPassword: [
        defaults.confirmPassword,
        [...passwordValidators, this.passwordConfirmingValidation],
      ],
    };
  }

  private getDefaultUserFormValue() {
    return {
      username: this.user.username,
      isAdmin: this.user.isAdmin,
      password: '',
      confirmPassword: '',
    };
  }

  private passwordConfirmingValidation(ctrl: AbstractControl) {
    if (
      ctrl.parent?.get('password')?.value !==
      ctrl.parent?.get('confirmPassword')?.value
    ) {
      return { pwdMismatch: true };
    }
    return null;
  }

  private createUserFormValueChangeHandler() {
    this.userFormService.toggleResetButton(this.createUserForm.dirty);
    this.userFormService.toggleSaveButton(
      this.createUserForm.dirty && this.createUserForm.status === 'VALID',
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
    this.createUserForm.reset(this.getDefaultUserFormValue());
  }

  private saveAction() {
    this.createUserPwdInputsHide = true;
    this.createUserProcessing = true;
    const userFormValue: UserFormValue = this.createUserForm.value;

    if (this.isEdit) {
      this.userFormService.updateUserHandler(userFormValue, this.user._id);
      return;
    }
    this.userFormService.createUserHandler(userFormValue);
  }
}
