import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEntityContentAuthorComponent } from './page-entity-content-author.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PageEntityContentAuthorComponent],
  exports: [PageEntityContentAuthorComponent],
  imports: [CommonModule, RouterModule],
})
export class PageEntityContentAuthorModule {}
