import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export type UploadInputFile = Express.Multer.File;

export class UploadInput {
  file: UploadInputFile;

  @IsBooleanString()
  readonly isPortrait: string;

  @IsBooleanString()
  readonly isSquare: string;

  @IsNumberString()
  readonly naturalHeight: string;

  @IsNumberString()
  readonly naturalWidth: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
