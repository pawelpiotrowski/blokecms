import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SearchModule } from '../../../search/search.module';
import { PageFormToolbarComponent } from './page-form-toolbar.component';

@NgModule({
  declarations: [PageFormToolbarComponent],
  exports: [PageFormToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    SearchModule,
  ],
})
export class PageFormToolbarModule {}
