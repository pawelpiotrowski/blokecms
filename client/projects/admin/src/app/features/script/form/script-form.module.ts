import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptFormComponent } from './script-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CodeEditModule } from 'shared-lib';

@NgModule({
  declarations: [ScriptFormComponent],
  exports: [ScriptFormComponent],
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
export class ScriptFormModule {}
