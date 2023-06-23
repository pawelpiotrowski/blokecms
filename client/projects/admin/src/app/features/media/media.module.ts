import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { MediaFormModule } from './form/media-form.module';
import { MediaViewModule } from './view/media-view.module';

@NgModule({
  declarations: [MediaComponent],
  exports: [MediaComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    MediaViewModule,
    MediaFormModule,
  ],
})
export class MediaModule {}
