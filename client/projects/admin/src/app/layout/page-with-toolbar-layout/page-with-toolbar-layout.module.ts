import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageWithToolbarLayoutComponent } from './page-with-toolbar-layout.component';
import { MainNavModule } from '../../nav/main-nav/main-nav.module';

@NgModule({
  declarations: [PageWithToolbarLayoutComponent],
  exports: [PageWithToolbarLayoutComponent],
  imports: [CommonModule, MatToolbarModule, MainNavModule],
})
export class PageWithToolbarLayoutModule {}
