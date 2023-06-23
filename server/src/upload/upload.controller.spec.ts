import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
jest.mock('multer');

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  describe('uploadFile', () => {
    it('should return uploaded file data', () => {
      const mockMulterFile: any = { filename: 'file' };

      const mockUploadBody = {
        file: '' as any,
        name: 'Hello',
        isPortrait: 'true',
        isSquare: 'false',
        naturalHeight: '200',
        naturalWidth: '300',
      };

      const uploadResp = controller.uploadFile(mockMulterFile, mockUploadBody);

      expect(uploadResp).toEqual({
        url: 'file',
        name: 'Hello',
        isPortrait: true,
        isSquare: false,
        naturalHeight: 200,
        naturalWidth: 300,
      });
    });
  });
});
