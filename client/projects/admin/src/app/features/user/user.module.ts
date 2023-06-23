import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { PageContentEntityLayoutModule } from '../../layout/page-content-entity-layout/page-content-entity-layout.module';
import { UserViewModule } from './view/user-view.module';
import { UserFormModule } from './form/user-form.module';

@NgModule({
  declarations: [UserComponent],
  exports: [UserComponent],
  imports: [
    CommonModule,
    PageContentEntityLayoutModule,
    UserViewModule,
    UserFormModule,
  ],
})
export class UserModule {}
