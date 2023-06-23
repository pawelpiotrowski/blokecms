/* eslint-disable no-console */
import { TestBed } from '@angular/core/testing';
import { loggerConfig } from './logger.interface';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: loggerConfig,
          useValue: { isProd: false },
        },
      ],
    });
    service = TestBed.inject(LoggerService);
  });

  describe('output', () => {
    it('should use console for logging if not in production', () => {
      service.log('hello');
      expect(console.log).toHaveBeenLastCalledWith(
        expect.stringContaining('hello'),
      );
      expect(console.log).toHaveBeenLastCalledWith(
        expect.stringContaining('[NG] - '),
      );
      expect(console.log).toHaveBeenLastCalledWith(
        expect.stringContaining('LOG'),
      );

      service.warn('world');
      expect(console.warn).toHaveBeenLastCalledWith(
        expect.stringContaining('world'),
      );
      expect(console.warn).toHaveBeenLastCalledWith(
        expect.stringContaining('[NG] - '),
      );
      expect(console.warn).toHaveBeenLastCalledWith(
        expect.stringContaining('WARN'),
      );

      jest.spyOn(console, 'debug').mockReturnValue();
      service.debug('foo');
      expect(console.debug).toHaveBeenLastCalledWith(
        expect.stringContaining('foo'),
      );
      expect(console.debug).toHaveBeenLastCalledWith(
        expect.stringContaining('[NG] - '),
      );
      expect(console.debug).toHaveBeenLastCalledWith(
        expect.stringContaining('DEBUG'),
      );

      service.error('bar');
      expect(console.error).toHaveBeenLastCalledWith(
        expect.stringContaining('bar'),
      );
      expect(console.error).toHaveBeenLastCalledWith(
        expect.stringContaining('[NG] - '),
      );
      expect(console.error).toHaveBeenLastCalledWith(
        expect.stringContaining('ERROR'),
      );
    });

    it('should include context and payload in log if provided', () => {
      service.log('log', 'from test');
      expect(console.log).toHaveBeenLastCalledWith(
        expect.stringContaining('log'),
      );
      expect(console.log).toHaveBeenLastCalledWith(
        expect.stringContaining('[from test]'),
      );
      service.error('error', 'from test', { payload: true });
      expect(console.error).toHaveBeenLastCalledWith(
        expect.stringContaining('error'),
        { payload: true },
      );
    });

    it('should ignore all the logs if in production', () => {
      const config = TestBed.inject(loggerConfig);
      config.isProd = true;

      service.log('I am ignored');
      expect(console.log).not.toHaveBeenLastCalledWith(
        expect.stringContaining('I am ignored'),
      );
    });
  });
});
