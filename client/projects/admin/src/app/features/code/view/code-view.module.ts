import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeViewComponent } from './code-view.component';
import { CodeEditModule } from 'shared-lib';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [CodeViewComponent],
  exports: [CodeViewComponent],
  imports: [CommonModule, MatCardModule, CodeEditModule],
})
export class CodeViewModule {}
