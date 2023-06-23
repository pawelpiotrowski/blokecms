import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { NavigationFormModule } from './form/navigation-form.module';
import { NavigationViewModule } from './view/navigation-view.module';

@NgModule({
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    NavigationFormModule,
    NavigationViewModule,
  ],
})
export class NavigationModule {}
