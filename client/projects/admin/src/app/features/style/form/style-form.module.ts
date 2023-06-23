import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleFormComponent } from './style-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CodeEditModule } from 'shared-lib';

@NgModule({
  declarations: [StyleFormComponent],
  exports: [StyleFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    CodeEditModule,
  ],
})
export class StyleFormModule {}
