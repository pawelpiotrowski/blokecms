import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageContentConfirmDialogData } from './page-content-confirm-dialog.interface';

@Component({
  selector: 'admin-page-content-confirm-dialog',
  templateUrl: './page-content-confirm-dialog.component.html',
})
export class PageContentConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<PageContentConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PageContentConfirmDialogData,
  ) {}

  cancel() {
    this.dialogRef.close();
  }
}
