import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockViewComponent } from './block-view.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [BlockViewComponent],
  exports: [BlockViewComponent],
  imports: [CommonModule, MatCardModule],
})
export class BlockViewModule {}
