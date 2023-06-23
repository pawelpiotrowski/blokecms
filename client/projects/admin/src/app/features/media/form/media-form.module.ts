import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaFormComponent } from './media-form.component';
import { MatCardModule } from '@angular/material/card';
import { SharedHttpModule } from 'shared-lib';
import { MediaUploadModule } from '../upload/media-upload.module';
import { MediaViewModule } from '../view/media-view.module';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MediaFormComponent],
  exports: [MediaFormComponent],
  imports: [
    CommonModule,
    MediaUploadModule,
    MatCardModule,
    MatInputModule,
    SharedHttpModule,
    MediaViewModule,
    ReactiveFormsModule,
  ],
})
export class MediaFormModule {}
