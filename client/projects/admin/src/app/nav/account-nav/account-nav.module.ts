import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountNavComponent } from './account-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AccountNavComponent],
  exports: [AccountNavComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule,
  ],
})
export class AccountNavModule {}
