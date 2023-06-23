import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    PageWithToolbarLayoutModule,
    MatTabsModule,
  ],
})
export class SettingsModule {}
