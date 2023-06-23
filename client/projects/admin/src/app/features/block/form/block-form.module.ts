import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockFormComponent } from './block-form.component';
import { MatCardModule } from '@angular/material/card';
import { NgxEditorModule } from 'ngx-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BlockFormImageMenuModule } from './image-menu/block-form-image-menu.module';

@NgModule({
  declarations: [BlockFormComponent],
  exports: [BlockFormComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    NgxEditorModule,
    ReactiveFormsModule,
    BlockFormImageMenuModule,
  ],
})
export class BlockFormModule {}
