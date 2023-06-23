import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { appConfig } from '../app.config';
import { AuthGuard } from '../auth/auth.guard';
import { uploadFileInterceptorForDiskStorage } from './upload.constants';
import { UploadInput, UploadInputFile } from './upload.interface';
const { api } = appConfig();

@Controller(`${api.url}/upload`)
export class UploadController {
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(uploadFileInterceptorForDiskStorage),
    }),
  )
  uploadFile(@UploadedFile() file: UploadInputFile, @Body() body: UploadInput) {
    const { name, isPortrait, isSquare, naturalHeight, naturalWidth } = body;

    return {
      url: file.filename,
      name,
      isPortrait: isPortrait === 'true',
      isSquare: isSquare === 'true',
      naturalHeight: Number(naturalHeight),
      naturalWidth: Number(naturalWidth),
    };
  }
}
