import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditComponent } from './code-edit.component';

@NgModule({
  declarations: [CodeEditComponent],
  exports: [CodeEditComponent],
  imports: [CommonModule],
})
export class CodeEditModule {}
