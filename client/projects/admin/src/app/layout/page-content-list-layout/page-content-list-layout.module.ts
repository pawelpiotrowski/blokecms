import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { PageContentListLayoutComponent } from './page-content-list-layout.component';
import { PageContentConfirmDialogModule } from '../page-content-confirm-dialog/page-content-confirm-dialog.module';

@NgModule({
  declarations: [PageContentListLayoutComponent],
  exports: [PageContentListLayoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatPaginatorModule,
    PageContentConfirmDialogModule,
  ],
})
export class PageContentListLayoutModule {}
