import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeComponent } from './code.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { CodeViewModule } from './view/code-view.module';
import { CodeFormModule } from './form/code-form.module';

@NgModule({
  declarations: [CodeComponent],
  exports: [CodeComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    CodeFormModule,
    CodeViewModule,
  ],
})
export class CodeModule {}
