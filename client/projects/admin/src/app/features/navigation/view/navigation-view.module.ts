import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationViewComponent } from './navigation-view.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [NavigationViewComponent],
  exports: [NavigationViewComponent],
  imports: [CommonModule, MatCardModule],
})
export class NavigationViewModule {}
