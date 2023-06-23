import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedHttpModule } from 'shared-lib';
import { LoginFormModule } from './form/login-form.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedHttpModule,
    LoginFormModule,
  ],
})
export class LoginModule {}
