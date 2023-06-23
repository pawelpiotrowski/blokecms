import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeFormComponent } from './code-form.component';
import { CodeEditModule } from 'shared-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CodeFormComponent],
  exports: [CodeFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    CodeEditModule,
  ],
})
export class CodeFormModule {}
