import { Controller, Get } from '@nestjs/common';
import { appConfig } from './app.config';
import { AppVersion } from './app.config.interface';
import { AppService } from './app.service';
const { api } = appConfig();

@Controller(api.url)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): AppVersion {
    return this.appService.getHello();
  }
}
