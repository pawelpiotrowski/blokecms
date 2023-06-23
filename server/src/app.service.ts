import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appConfigNameSpace } from './app.config';
import { AppConfig, AppVersion } from './app.config.interface';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): AppVersion {
    return {
      version: this.configService.get<AppConfig>(appConfigNameSpace).version,
    };
  }
}
