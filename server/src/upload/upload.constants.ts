import { DiskStorageOptions } from 'multer';
import { extname } from 'path';
import { appConfig } from '../app.config';
const { ui } = appConfig();

export const uploadFileInterceptorForDiskStorage: DiskStorageOptions = {
  destination: `./${ui.files.dir}`,
  filename: (_, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return cb(null, `${randomName}${extname(file.originalname.toLowerCase())}`);
  },
};
