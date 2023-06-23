import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaUploadComponent } from './media-upload.component';
import { MediaUploadDragDropDirective } from './media-upload-dragdrop.directive';

@NgModule({
  declarations: [MediaUploadComponent, MediaUploadDragDropDirective],
  exports: [MediaUploadComponent],
  imports: [CommonModule],
})
export class MediaUploadModule {}
