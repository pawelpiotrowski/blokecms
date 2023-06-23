import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationFormComponent } from './navigation-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NavigationFormContentModule } from './content/navigation-form-content.module';

@NgModule({
  declarations: [NavigationFormComponent],
  exports: [NavigationFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    NavigationFormContentModule,
  ],
})
export class NavigationFormModule {}
