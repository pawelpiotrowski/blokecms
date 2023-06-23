import { Injectable, Inject } from '@angular/core';
import { loggerConfig, LoggerModuleConfig, LogLevel } from './logger.interface';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(@Inject(loggerConfig) private config: LoggerModuleConfig) {}

  /**
   * Write a 'log' level log.
   */
  log(message: string, context = '', payload: any = null) {
    this.output('log', message, context, payload);
  }
  /**
   * Write an 'error' level log.
   */
  error(message: string, context = '', payload: any = null) {
    this.output('error', message, context, payload);
  }
  /**
   * Write a 'warn' level log.
   */
  warn(message: string, context = '', payload: any = null) {
    this.output('warn', message, context, payload);
  }
  /**
   * Write a 'debug' level log.
   */
  debug(message: string, context = '', payload: any = null) {
    this.output('debug', message, context, payload);
  }

  private output(
    level: LogLevel,
    message: string,
    context: string,
    payload: any,
  ) {
    if (this.config.isProd) {
      return;
    }

    const contextStr = context.length > 0 ? ` [${context}] ` : ' ';
    const fullLog = [
      `[NG] - ${new Date().toLocaleString()} ${level.toUpperCase()}${contextStr}${message}`,
    ];

    if (payload !== null) {
      fullLog.push(payload);
    }

    // eslint-disable-next-line no-console
    console[level](...fullLog);
  }
}
