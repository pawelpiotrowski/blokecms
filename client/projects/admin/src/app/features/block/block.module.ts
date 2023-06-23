import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockComponent } from './block.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { BlockFormModule } from './form/block-form.module';
import { BlockViewModule } from './view/block-view.module';

@NgModule({
  declarations: [BlockComponent],
  exports: [BlockComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    BlockFormModule,
    BlockViewModule,
  ],
})
export class BlockModule {}
