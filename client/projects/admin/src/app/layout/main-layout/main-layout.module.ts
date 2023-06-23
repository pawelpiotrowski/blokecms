import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountNavModule } from '../../nav/account-nav/account-nav.module';

@NgModule({
  declarations: [MainLayoutComponent],
  exports: [MainLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AccountNavModule,
  ],
})
export class MainLayoutModule {}
