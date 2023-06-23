import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFormComponent } from './page-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { PageFormToolbarModule } from './toolbar/page-form-toolbar.module';
import { PageFormContentModule } from './content/page-form-content.module';

@NgModule({
  declarations: [PageFormComponent],
  exports: [PageFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    PageFormToolbarModule,
    PageFormContentModule,
  ],
})
export class PageFormModule {}
