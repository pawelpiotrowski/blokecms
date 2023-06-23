import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { PageComponent } from './page.component';
import { PageViewModule } from './view/page-view.module';
import { PageFormModule } from './form/page-form.module';

@NgModule({
  declarations: [PageComponent],
  exports: [PageComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    PageViewModule,
    PageFormModule,
  ],
})
export class PageModule {}
