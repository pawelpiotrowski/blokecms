import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationFormContentComponent } from './navigation-form-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationFormLinkModule } from '../link/navigation-form-link.module';
import { NavigationFormToolbarModule } from '../toolbar/navigation-form-toolbar.module';

@NgModule({
  declarations: [NavigationFormContentComponent],
  exports: [NavigationFormContentComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    NavigationFormLinkModule,
    NavigationFormToolbarModule,
  ],
})
export class NavigationFormContentModule {}
