import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { httpConfig, HttpModuleConfig } from './http.interface';

@NgModule({
  exports: [HttpClientModule],
})
export class SharedHttpModule {
  public static forRoot(
    moduleConfig: HttpModuleConfig,
  ): ModuleWithProviders<SharedHttpModule> {
    return {
      ngModule: SharedHttpModule,
      providers: [
        {
          provide: httpConfig,
          useValue: moduleConfig,
        },
      ],
    };
  }
}
