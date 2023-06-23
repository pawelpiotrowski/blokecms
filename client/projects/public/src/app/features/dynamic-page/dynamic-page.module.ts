import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPageRoutingModule } from './dynamic-page-routing.module';
import { DynamicPageComponent } from './dynamic-page.component';
import { PageModule } from '../../page/page.module';

@NgModule({
  declarations: [DynamicPageComponent],
  imports: [CommonModule, DynamicPageRoutingModule, PageModule],
})
export class DynamicPageModule {}
