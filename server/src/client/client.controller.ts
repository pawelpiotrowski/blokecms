/**
 * Prerendering and serving angular universal
 * As per this article: https://blog.angular-university.io/angular-universal/
 */
import 'zone.js';
/*
 * There is an issue with passport auth after enabling zone.js: https://github.com/nestjs/ng-universal/issues/172
 */
Zone[Zone.__symbol__('ignoreConsoleErrorUncaughtError')] = true;
/* On the side note there is interesting idea of using `zone.js` in node server
 * for request handling a bit like "ThreadLocal-storage"
 * See: https://github.com/angular/zone.js/issues/411
 */

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  StreamableFile,
  Res,
  Next,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AppServerModule, renderModule } from '../../ui-public/server/main';
import { createReadStream, constants, promises } from 'fs';
import { join } from 'path';
import { lookup } from 'mime-types';
import { ClientService } from './client.service';

import {
  adminIndexHtml,
  adminUrl,
  defaultMimeType,
  filesUrl,
  getPublicServerBundleExceptionMessage,
  publicIndexHtml,
  publicUrl,
  uiAdminBundleDirPath,
  uiFilesBundleDirPath,
  uiPublicBrowserBundleDirPath,
  rateLimit,
  rateLimitDisabled,
} from './client.service.constants';

interface GetClientFileException {
  message: string;
  status: HttpStatus;
}

@Controller()
@UseGuards(ThrottlerGuard)
@Throttle(rateLimit.limit, rateLimit.ttl)
@SkipThrottle(rateLimitDisabled)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(`${filesUrl}/*.*`)
  async getStaticFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const reqFile = this.getFileUrlReplacement(filesUrl, req.originalUrl);

    return this.getClientFile(res, reqFile, uiFilesBundleDirPath);
  }

  @Get(`${adminUrl}/*.*`)
  async getAdminFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const reqFile = this.getFileUrlReplacement(adminUrl, req.originalUrl);

    return this.getClientFile(res, reqFile, uiAdminBundleDirPath);
  }

  @Get(`${adminUrl}*`)
  async getAdminIndexHtml(
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    res.set(this.getContentTypeHeader());

    return adminIndexHtml;
  }

  @Get(`${publicUrl}/*.*`)
  async getPublicFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const reqFile = this.getFileUrlReplacement(publicUrl, req.originalUrl);

    return this.getClientFile(res, reqFile, uiPublicBrowserBundleDirPath);
  }

  @Get(`${publicUrl}*`)
  async getPublicServerBundle(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Next() next,
  ): Promise<string> {
    if (this.clientService.shouldAttemptNextHandler(req.originalUrl)) {
      return next();
    }
    try {
      const t0 = performance.now();
      let publicIndexHtmlWithStyleAndScript =
        await this.clientService.injectPublicMainStyle(publicIndexHtml);
      publicIndexHtmlWithStyleAndScript =
        await this.clientService.injectPublicMainScript(
          publicIndexHtmlWithStyleAndScript,
        );
      const publicServerBundle = await renderModule(AppServerModule, {
        document: publicIndexHtmlWithStyleAndScript,
        url: req.originalUrl,
      });

      res.set(this.getContentTypeHeader());

      const t1 = performance.now();
      Logger.log(
        `Call to prerender took ${t1 - t0} milliseconds.`,
        ClientController.name,
      );

      return publicServerBundle;
    } catch (err) {
      throw new HttpException(
        getPublicServerBundleExceptionMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private get defaultGetClientFileException(): GetClientFileException {
    return { message: 'Not Found', status: HttpStatus.NOT_FOUND };
  }

  private async getClientFile(
    res: Response,
    file: string,
    dir: string,
    exception: GetClientFileException = this.defaultGetClientFileException,
  ): Promise<StreamableFile> {
    const fileSanitized = this.clientService.sanitizeFilename(file);

    if (fileSanitized.startsWith('.') || fileSanitized.startsWith('/')) {
      this.throwGetClientFileException(exception);
    }
    const filePath = join(process.cwd(), dir, fileSanitized);

    try {
      await promises.access(filePath, constants.F_OK | constants.R_OK);

      const fileStream = createReadStream(filePath);
      const mimeType = lookup(filePath) || defaultMimeType;

      res.set(this.getContentTypeHeader(mimeType));

      return new StreamableFile(fileStream);
    } catch (err) {
      this.throwGetClientFileException(exception);
    }
  }

  private throwGetClientFileException(exception: GetClientFileException) {
    const { message, status } = exception;

    throw new HttpException(message, status);
  }

  private getContentTypeHeader(forMimeType = 'text/html') {
    return { 'Content-Type': forMimeType };
  }

  private getFileUrlReplacement(forClientUrl: string, reqFileUrl: string) {
    const replacement = forClientUrl.length === 0 ? `/` : `/${forClientUrl}/`;

    return reqFileUrl.replace(replacement, '');
  }
}
