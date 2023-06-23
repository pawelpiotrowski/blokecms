import { InjectionToken } from '@angular/core';

export interface LoggerModuleConfig {
  isProd: boolean;
}

export const loggerConfig = new InjectionToken<LoggerModuleConfig>(
  'loggerConfig',
);

export type LogLevel = 'log' | 'error' | 'warn' | 'debug';
