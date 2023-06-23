import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleViewComponent } from './style-view.component';
import { CodeEditModule } from 'shared-lib';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [StyleViewComponent],
  exports: [StyleViewComponent],
  imports: [CommonModule, MatCardModule, CodeEditModule],
})
export class StyleViewModule {}
