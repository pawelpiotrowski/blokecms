import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StylesRoutingModule } from './styles-routing.module';
import { StylesComponent } from './styles.component';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';

@NgModule({
  declarations: [StylesComponent],
  imports: [
    CommonModule,
    StylesRoutingModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class StylesModule {}
