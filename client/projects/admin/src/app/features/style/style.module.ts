import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleComponent } from './style.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { StyleFormModule } from './form/style-form.module';
import { StyleViewModule } from './view/style-view.module';

@NgModule({
  declarations: [StyleComponent],
  exports: [StyleComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    StyleFormModule,
    StyleViewModule,
  ],
})
export class StyleModule {}
