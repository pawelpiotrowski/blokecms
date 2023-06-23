import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, appConfigNameSpace } from './app.config';
import { NodeEnv } from './app.config.interface';
import { configDefault } from './app.config.default';

@Injectable()
class TestConfigService {
  constructor(public configService: ConfigService) {}
}

describe('appConfig', () => {
  const copyProcessEnv = { ...process.env };
  let configService: ConfigService;

  const setTestingModule = async (nodeEnv = null) => {
    jest.resetModules(); // important - it clears the cache so we can mess with process.env
    if (typeof nodeEnv === 'string') {
      process.env.NODE_ENV = nodeEnv;
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [TestConfigService],
    }).compile();

    configService =
      module.get<TestConfigService>(TestConfigService).configService;
  };

  afterAll(() => {
    process.env = copyProcessEnv;
  });

  describe('defaults', () => {
    beforeEach(async () => {
      await setTestingModule();
    });

    it('should be defined', () => {
      expect(configService.get(appConfigNameSpace)).toBeDefined();
    });

    it('should populate default values for "port" and "nodeEnv" properties', () => {
      expect(configService.get(appConfigNameSpace).http.port).toEqual(
        configDefault.http.port,
      );
      expect(configService.get(appConfigNameSpace).api.url).toEqual(
        configDefault.api.url,
      );
      // in test we get "test" by default
      expect(configService.get(appConfigNameSpace).nodeEnv).toEqual(
        NodeEnv.TEST,
      );
      expect(configService.get(appConfigNameSpace).isDev).toEqual(false);
      expect(configService.get(appConfigNameSpace).isProd).toEqual(false);
      expect(configService.get(appConfigNameSpace).isTest).toEqual(true);
    });
  });

  describe('when NODE_ENV is not matching NodeEnv Enum', () => {
    beforeEach(async () => {
      await setTestingModule('foo');
    });

    it('should return NodeEnv.DEV as config "nodeEnv" property', () => {
      expect(configService.get(appConfigNameSpace).nodeEnv).toEqual(
        NodeEnv.DEV,
      );
      expect(configService.get(appConfigNameSpace).isDev).toEqual(true);
      expect(configService.get(appConfigNameSpace).isProd).toEqual(false);
      expect(configService.get(appConfigNameSpace).isTest).toEqual(false);
    });
  });

  describe('when NODE_ENV is matching NodeEnv Enum "DEV"', () => {
    beforeEach(async () => {
      await setTestingModule('development');
    });

    it('should return NodeEnv.DEV as config "nodeEnv" property', () => {
      expect(configService.get(appConfigNameSpace).nodeEnv).toEqual(
        NodeEnv.DEV,
      );
      expect(configService.get(appConfigNameSpace).isDev).toEqual(true);
      expect(configService.get(appConfigNameSpace).isProd).toEqual(false);
      expect(configService.get(appConfigNameSpace).isTest).toEqual(false);
    });
  });

  describe('when NODE_ENV is matching NodeEnv Enum "TEST"', () => {
    beforeEach(async () => {
      await setTestingModule('test');
    });

    it('should return NodeEnv.DEV as config "nodeEnv" property', () => {
      expect(configService.get(appConfigNameSpace).nodeEnv).toEqual(
        NodeEnv.TEST,
      );
      expect(configService.get(appConfigNameSpace).isDev).toEqual(false);
      expect(configService.get(appConfigNameSpace).isProd).toEqual(false);
      expect(configService.get(appConfigNameSpace).isTest).toEqual(true);
    });
  });

  describe('when NODE_ENV is matching NodeEnv Enum "PROD"', () => {
    beforeEach(async () => {
      await setTestingModule('production');
    });

    it('should return NODE_ENV as config "nodeEnv" property', () => {
      expect(configService.get(appConfigNameSpace).nodeEnv).toEqual(
        NodeEnv.PROD,
      );
      expect(configService.get(appConfigNameSpace).isDev).toEqual(false);
      expect(configService.get(appConfigNameSpace).isProd).toEqual(true);
      expect(configService.get(appConfigNameSpace).isTest).toEqual(false);
    });
  });
});
