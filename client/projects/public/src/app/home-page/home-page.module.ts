import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { PageModule } from '../page/page.module';

@NgModule({
  declarations: [HomePageComponent],
  exports: [HomePageComponent],
  imports: [CommonModule, PageModule],
})
export class HomePageModule {}
