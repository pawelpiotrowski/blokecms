import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './not-found-page.component';

@NgModule({
  declarations: [NotFoundPageComponent],
  exports: [NotFoundPageComponent],
  imports: [CommonModule],
})
export class NotFoundPageModule {}
