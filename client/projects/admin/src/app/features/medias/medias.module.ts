import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediasRoutingModule } from './medias-routing.module';
import { MediasComponent } from './medias.component';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';

@NgModule({
  declarations: [MediasComponent],
  imports: [
    CommonModule,
    MediasRoutingModule,
    PageWithToolbarLayoutModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class MediasModule {}
