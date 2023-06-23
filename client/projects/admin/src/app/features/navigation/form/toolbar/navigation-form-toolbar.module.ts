import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationFormToolbarComponent } from './navigation-form-toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationFormLinkModule } from '../link/navigation-form-link.module';

@NgModule({
  declarations: [NavigationFormToolbarComponent],
  exports: [NavigationFormToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NavigationFormLinkModule,
  ],
})
export class NavigationFormToolbarModule {}
