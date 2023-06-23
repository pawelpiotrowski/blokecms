import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { DashboardInsightsModule } from './insights/dashboard-insights.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PageWithToolbarLayoutModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    DashboardInsightsModule,
  ],
})
export class DashboardModule {}
