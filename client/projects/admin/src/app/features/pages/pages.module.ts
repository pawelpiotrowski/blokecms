import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    PageWithToolbarLayoutModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class PagesModule {}
