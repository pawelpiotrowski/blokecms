import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewComponent } from './user-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { PageEntityContentAuthorModule } from '../../../layout/page-entity-content-author/page-entity-content-author.module';

@NgModule({
  declarations: [UserViewComponent],
  exports: [UserViewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    PageEntityContentAuthorModule,
  ],
})
export class UserViewModule {}
