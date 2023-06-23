import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import {
  SharedHttpModule,
  SharedGraphQLModule,
  LoggerModule,
} from 'shared-lib';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    AppRoutingModule,
    // Needed for apollo gql services
    // to support server side calls to http we need to override base url
    SharedHttpModule.forRoot({ useAbsoluteUrl: environment.production }),
    // to support server side calls to gql we need to override base url
    SharedGraphQLModule.forRoot({ useAbsoluteUrl: environment.production }),
    LoggerModule.forRoot({ isProd: environment.production }),
    NavigationModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
