import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardInsightsComponent } from './dashboard-insights.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardInsightsComponent],
  exports: [DashboardInsightsComponent],
  imports: [CommonModule, MatDividerModule, RouterModule],
})
export class DashboardInsightsModule {}
