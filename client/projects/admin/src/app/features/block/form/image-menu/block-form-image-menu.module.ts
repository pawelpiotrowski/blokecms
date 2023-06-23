import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockFormImageMenuComponent } from './block-form-image-menu.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BlockFormImageMenuComponent],
  exports: [BlockFormImageMenuComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BlockFormImageMenuModule {}
