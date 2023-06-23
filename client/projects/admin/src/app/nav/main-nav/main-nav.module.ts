import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainNavComponent } from './main-nav.component';

@NgModule({
  declarations: [MainNavComponent],
  exports: [MainNavComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
})
export class MainNavModule {}
