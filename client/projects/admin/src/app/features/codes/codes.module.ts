import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { CodesRoutingModule } from './codes-routing.module';
import { CodesComponent } from './codes.component';

@NgModule({
  declarations: [CodesComponent],
  imports: [
    CommonModule,
    CodesRoutingModule,
    PageWithToolbarLayoutModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class CodesModule {}
