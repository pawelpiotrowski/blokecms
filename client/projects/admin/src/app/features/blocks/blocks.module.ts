import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { BlocksRoutingModule } from './blocks-routing.module';
import { BlocksComponent } from './blocks.component';

@NgModule({
  declarations: [BlocksComponent],
  imports: [
    CommonModule,
    BlocksRoutingModule,
    PageWithToolbarLayoutModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class BlocksModule {}
