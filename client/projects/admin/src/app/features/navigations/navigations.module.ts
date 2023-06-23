import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationsComponent } from './navigations.component';
import { NavigationsRoutingModule } from './navigations-routing.module';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';

@NgModule({
  declarations: [NavigationsComponent],
  imports: [
    CommonModule,
    NavigationsRoutingModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class NavigationsModule {}
