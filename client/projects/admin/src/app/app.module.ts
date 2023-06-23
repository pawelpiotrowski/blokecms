import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideEffectsManager, provideEffects } from '@ngneat/effects-ng';
import {
  LoggerModule,
  SharedGraphQLModule,
  SharedHttpModule,
} from 'shared-lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';
import { LoginFormModule } from './features/login/form/login-form.module';
import { environment } from '../environments/environment';
import { AdminAuthEffects } from './auth/admin-auth.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppEffects } from './app.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedHttpModule,
    SharedGraphQLModule,
    BrowserAnimationsModule,
    MainLayoutModule,
    LoginFormModule,
    LoggerModule.forRoot({ isProd: environment.production }),
    MatSnackBarModule,
  ],
  providers: [
    provideEffectsManager(),
    provideEffects(AdminAuthEffects, AppEffects),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
