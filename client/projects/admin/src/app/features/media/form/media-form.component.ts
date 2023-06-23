import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take, filter, finalize, pipe, Subscription } from 'rxjs';
import { ApiService, ApiUpload, BlockMedia } from 'shared-lib';
import {
  PageContentEntityToolbarButtonAction,
  PageContentEntityToolbarButtons,
} from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { MediaUploadFile } from '../upload/media-upload.interface';
import { MediaFormService } from './media-form.service';

@Component({
  selector: 'admin-media-form',
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.scss'],
  providers: [MediaFormService],
})
export class MediaFormComponent implements OnInit, OnDestroy {
  @Input() blockMedia!: BlockMedia;
  isEdit!: boolean;
  mediaUploadFile: MediaUploadFile | null = null;
  mediaUploadFilePreview!: string | ArrayBuffer | null | undefined;
  mediaForm!: FormGroup;

  private entityRepoSubscription!: Subscription;

  constructor(
    private api: ApiService,
    private entityRepo: PageEntityContentRepository,
    private mediaFormService: MediaFormService,
  ) {}

  ngOnInit(): void {
    this.mediaFormService.toggleSaveButton(false);
    this.mediaFormService.toggleResetButton(false);
    this.entityRepoSubscription = this.entityRepo.buttonsAction$
      .pipe(this.buttonsActionPipe())
      .subscribe(this.buttonsActionHandler.bind(this));
    this.isEdit = this.blockMedia && this.blockMedia._id.length > 0;
    this.setMediaForm();
  }

  ngOnDestroy(): void {
    this.entityRepoSubscription.unsubscribe();
  }

  onMediaAdded($event: MediaUploadFile) {
    this.mediaUploadFile = $event;
    const reader = new FileReader();

    reader.onload = this.fileReaderOnLoadHandler.bind(this);
    reader.readAsDataURL(this.mediaUploadFile.file);
    this.mediaForm.patchValue({
      name: $event.file.name,
    });
  }

  get mediaFormCtrl() {
    return this.mediaForm.controls;
  }

  private setMediaForm() {
    this.mediaForm = new FormGroup({
      name: new FormControl(this.blockMedia?.name, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });

    // article value change subscription
    this.mediaForm.valueChanges.subscribe(
      this.mediaFormValueChangeHandler.bind(this),
    );
  }

  private mediaFormValueChangeHandler() {
    this.mediaFormService.toggleResetButton(this.mediaForm.dirty);
    this.mediaFormService.toggleSaveButton(
      this.mediaForm.dirty && this.mediaForm.status === 'VALID',
    );
  }

  private fileReaderOnLoadHandler(event: ProgressEvent<FileReader>) {
    this.mediaUploadFilePreview = event.target?.result;
    this.mediaFormService.toggleSaveButton(true);
    this.mediaFormService.toggleResetButton(true);
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
    this.mediaUploadFilePreview = null;
    this.mediaUploadFile = null;
    this.mediaFormService.toggleSaveButton(false);
    this.mediaFormService.toggleResetButton(false);
  }

  private saveAction() {
    this.mediaFormService.toggleSaveButton(false);
    this.mediaFormService.toggleResetButton(false);
    this.upload();
  }

  private upload() {
    if (this.mediaUploadFile == null) {
      this.uploadHandler({ name: this.mediaForm.value.name });
      return;
    }

    const formData = new FormData();
    const { file, ...meta } = this.mediaUploadFile as MediaUploadFile;

    formData.append('file', file);
    formData.append('name', this.mediaForm.value.name);
    Object.entries(meta).forEach(([key, value]) => {
      formData.append(key, `${value}`);
    });

    this.api
      .upload(formData)
      .pipe(
        finalize(() => {
          // this.uploading = false;
        }),
        take(1),
      )
      .subscribe({
        next: this.uploadHandler.bind(this),
        error: this.uploadErrorHandler.bind(this),
      });
  }

  private uploadHandler(data: Partial<ApiUpload>): void {
    if (this.isEdit) {
      this.mediaFormService.uploadUpdateHandler(data, this.blockMedia._id);
      return;
    }
    this.mediaFormService.uploadCreateHandler(data as ApiUpload);
  }

  private uploadErrorHandler(err: any): void {
    this.mediaFormService.uploadErrorHandler(err);
  }
}
