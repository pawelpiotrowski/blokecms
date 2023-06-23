import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { of } from 'rxjs';
import { AppServerModule, renderModule } from '../../ui-public/server/main';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

import {
  defaultMimeType,
  getPublicServerBundleExceptionMessage,
  publicIndexHtml,
  uiAdminBundleDirPath,
  uiPublicBrowserBundleDirPath,
} from './client.service.constants';
import { ThrottlerModule } from '@nestjs/throttler';

// mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('<html></html>'),
  promises: {
    access: jest.fn(),
  },
  constants: {
    F_OK: 1,
    R_OK: 0,
  },
  createReadStream: jest.fn(),
}));

// mock client public universal bundle
jest.mock('../../ui-public/server/main', () => ({
  AppServerModule: {},
  renderModule: jest.fn(),
}));

jest.mock('../app.config', () => ({
  appConfig: jest.fn().mockReturnValue({
    ui: {
      admin: { url: 'admin', dir: 'admin' },
      public: { url: '', dir: 'public' },
      files: { url: 'files', dir: 'files' },
    },
    gql: {
      url: 'test',
    },
    api: {
      rateLimit: {
        clientFiles: {
          ttl: 10,
          limit: 10,
        },
      },
    },
  }),
}));

const mockClientService = {
  shouldAttemptNextHandler: jest.fn(),
  injectPublicMainStyle: jest.fn(),
  injectPublicMainScript: jest.fn(),
  sanitizeFilename: jest.fn(),
};

jest.mock('./client.service', () => ({
  ClientService: {},
}));

describe('ClientController', () => {
  let controller: ClientController;
  let clientService: ClientService;
  const mockRes: any = { set: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      imports: [
        ThrottlerModule.forRoot({
          ttl: 100,
          limit: 100,
        }),
      ],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAdminIndexHtml', () => {
    it('should return client admin index html file', async () => {
      const result = await controller.getAdminIndexHtml(mockRes);

      expect(mockRes.set).toHaveBeenLastCalledWith({
        'Content-Type': 'text/html',
      });
      expect(typeof result).toEqual('string');
      expect(result).toEqual('<html></html>');
    });
  });

  describe('getPublicServerBundle', () => {
    const mockReq: any = { originalUrl: '/test' };

    it('should attempt to render client public server bundle', async () => {
      const mockPublicWithStyleAndScript = '<html></html>';
      (clientService.injectPublicMainStyle as jest.Mock).mockReturnValue(
        mockPublicWithStyleAndScript,
      );
      (clientService.injectPublicMainScript as jest.Mock).mockReturnValue(
        mockPublicWithStyleAndScript,
      );
      await controller.getPublicServerBundle(mockReq, mockRes, jest.fn());

      expect(renderModule).toHaveBeenCalledWith(AppServerModule, {
        document: mockPublicWithStyleAndScript,
        url: mockReq.originalUrl,
      });
      expect(clientService.injectPublicMainStyle).toHaveBeenLastCalledWith(
        publicIndexHtml,
      );
      expect(clientService.injectPublicMainScript).toHaveBeenLastCalledWith(
        mockPublicWithStyleAndScript,
      );
    });

    it('should return rendered client public html and set correct mime type', async () => {
      const mockRenderedHtml = '<hello />';
      renderModule.mockImplementationOnce(
        jest.fn().mockResolvedValue(mockRenderedHtml),
      );

      const result = await controller.getPublicServerBundle(
        mockReq,
        mockRes,
        jest.fn(),
      );

      expect(result).toEqual(mockRenderedHtml);
      expect(mockRes.set).toHaveBeenLastCalledWith({
        'Content-Type': 'text/html',
      });
    });

    it('should throw 500 exception if rendering throws', async () => {
      expect.assertions(3);
      renderModule.mockImplementationOnce(
        jest.fn().mockRejectedValue(new Error('error')),
      );

      try {
        await controller.getPublicServerBundle(mockReq, mockRes, jest.fn());
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty(
          'message',
          getPublicServerBundleExceptionMessage,
        );
        expect(error).toHaveProperty(
          'status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    it('should return early depending on service flag', () => {
      jest
        .spyOn(clientService, 'shouldAttemptNextHandler')
        .mockReturnValue(true);
      const mockNext = jest.fn();
      controller.getPublicServerBundle(mockReq, mockReq, mockNext);

      expect(mockNext).toBeCalled();
    });
  });

  describe('getClientFile', () => {
    const mockPublicFileReq: any = { originalUrl: '/test.jpg' };
    const mockAdminFileReq: any = { originalUrl: '/admin/test.jpg' };
    const mockFilesFileReq: any = { originalUrl: '/files/test.jpg' };

    beforeEach(() => {
      jest.spyOn(fs, 'createReadStream').mockReturnValue(of('test') as any);
    });

    it('should check if the file exists', async () => {
      const fsAccessSpy = jest.spyOn(fs.promises, 'access').mockResolvedValue();
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue('test.jpg');

      await controller.getPublicFile(mockPublicFileReq, mockRes);

      expect(fsAccessSpy).toHaveBeenLastCalledWith(
        expect.stringContaining(
          join(uiPublicBrowserBundleDirPath, mockPublicFileReq.originalUrl),
        ),
        expect.any(Number),
      );

      await controller.getAdminFile(mockAdminFileReq, mockRes);

      expect(fsAccessSpy).toHaveBeenLastCalledWith(
        expect.stringContaining(
          join(
            uiAdminBundleDirPath,
            mockAdminFileReq.originalUrl.replace('/admin/', ''),
          ),
        ),
        expect.any(Number),
      );

      await controller.getStaticFile(mockFilesFileReq, mockRes);
    });

    it('should throw 404 exception if the file do NOT exists', async () => {
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue('');
      expect.assertions(3);
      jest.spyOn(fs.promises, 'access').mockRejectedValue('Error');

      try {
        await controller.getPublicFile(mockPublicFileReq, mockRes);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty('message', 'Not Found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });

    it('should throw 404 exception if requested file is a dot file', async () => {
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue('.');
      expect.assertions(6);

      const mockPublicDotFileFileReq: any = { originalUrl: '/.test' };

      try {
        await controller.getPublicFile(mockPublicDotFileFileReq, mockRes);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty('message', 'Not Found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }

      const mockAdminDotFileFileReq: any = { originalUrl: '/admin/.test' };

      try {
        await controller.getAdminFile(mockAdminDotFileFileReq, mockRes);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toHaveProperty('message', 'Not Found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });

    it('should return StreamableFile if the file exists', async () => {
      jest.spyOn(fs.promises, 'access').mockResolvedValue();
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue('test.jpg');

      const resultPublic = await controller.getPublicFile(
        mockPublicFileReq,
        mockRes,
      );

      expect(resultPublic).toBeInstanceOf(StreamableFile);
      expect(fs.createReadStream).toHaveBeenLastCalledWith(
        expect.stringContaining(
          join(uiPublicBrowserBundleDirPath, mockPublicFileReq.originalUrl),
        ),
      );

      const resultAdmin = await controller.getAdminFile(
        mockAdminFileReq,
        mockRes,
      );

      expect(resultAdmin).toBeInstanceOf(StreamableFile);
      expect(fs.createReadStream).toHaveBeenLastCalledWith(
        expect.stringContaining(
          join(
            uiAdminBundleDirPath,
            mockAdminFileReq.originalUrl.replace('/admin/', ''),
          ),
        ),
      );
    });

    it('should return correct mimetype if the file exists', async () => {
      jest.spyOn(fs.promises, 'access').mockResolvedValue();
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue('test.jpg');

      await controller.getPublicFile(mockPublicFileReq, mockRes);

      expect(mockRes.set).toHaveBeenLastCalledWith({
        'Content-Type': 'image/jpeg',
      });
    });

    it('should return default mimetype if the file exists with unknown ext', async () => {
      const mockReqUnknownFileExt: any = { originalUrl: '/test.test' };
      jest.spyOn(fs.promises, 'access').mockResolvedValue();
      (clientService.sanitizeFilename as jest.Mock).mockReturnValue(
        'test.test',
      );

      await controller.getPublicFile(mockReqUnknownFileExt, mockRes);

      expect(mockRes.set).toHaveBeenLastCalledWith({
        'Content-Type': defaultMimeType,
      });
    });
  });
});
