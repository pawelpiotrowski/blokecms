import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PageEntityContentAuthorModule } from '../../../layout/page-entity-content-author/page-entity-content-author.module';
import { MediaViewComponent } from './media-view.component';

@NgModule({
  declarations: [MediaViewComponent],
  exports: [MediaViewComponent],
  imports: [CommonModule, MatCardModule, PageEntityContentAuthorModule],
})
export class MediaViewModule {}
