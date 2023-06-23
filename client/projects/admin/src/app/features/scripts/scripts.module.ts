import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptsRoutingModule } from './scripts-routing.module';
import { ScriptsComponent } from './scripts.component';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';

@NgModule({
  declarations: [ScriptsComponent],
  imports: [
    CommonModule,
    ScriptsRoutingModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class ScriptsModule {}
