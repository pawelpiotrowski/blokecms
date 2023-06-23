import { ModuleWithProviders, NgModule } from '@angular/core';
import { loggerConfig, LoggerModuleConfig } from './logger.interface';

@NgModule({})
export class LoggerModule {
  public static forRoot(
    moduleConfig: LoggerModuleConfig,
  ): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {
          provide: loggerConfig,
          useValue: moduleConfig,
        },
      ],
    };
  }
}
