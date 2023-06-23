import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { PageWithToolbarLayoutModule } from '../../layout/page-with-toolbar-layout/page-with-toolbar-layout.module';
import { PageWithChildDrawerLayoutModule } from '../../layout/page-with-child-drawer-layout/page-with-child-drawer-layout.module';
import { PageContentListLayoutModule } from '../../layout/page-content-list-layout/page-content-list-layout.module';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    PageWithToolbarLayoutModule,
    PageWithChildDrawerLayoutModule,
    PageContentListLayoutModule,
  ],
})
export class UsersModule {}
