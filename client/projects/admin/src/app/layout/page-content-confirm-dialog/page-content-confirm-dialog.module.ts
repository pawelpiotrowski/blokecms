import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PageContentConfirmDialogComponent } from './page-content-confirm-dialog.component';

@NgModule({
  declarations: [PageContentConfirmDialogComponent],
  exports: [PageContentConfirmDialogComponent, MatDialogModule],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
})
export class PageContentConfirmDialogModule {}
