import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockComponent } from './block.component';
import { CodeEditModule } from 'shared-lib';

@NgModule({
  declarations: [BlockComponent],
  exports: [BlockComponent],
  imports: [CommonModule, CodeEditModule],
})
export class BlockModule {}
