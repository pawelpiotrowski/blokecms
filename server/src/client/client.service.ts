import { Injectable } from '@nestjs/common';
import * as truncate from 'truncate-utf8-bytes';
import { configGql, configIsDev } from './client.service.constants';
import { StyleService } from '../settings/style/style.service';
import { ScriptService } from '../settings/script/script.service';

const MAX_FILENAME_LENGTH = 255;
const illegalRe = /[\/\?<>\\:\*\|":]/g;
/* tslint:disable-next-line:no-control-regex */
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;

interface FilenamifyOptions {
  replacement: string;
}

@Injectable()
export class ClientService {
  constructor(
    private styleService: StyleService,
    private scriptService: ScriptService,
  ) {}

  async injectPublicMainStyle(forIndexFile: string) {
    try {
      const mainStyle = await this.styleService.findOne({ name: 'main' });

      if (mainStyle.minified && mainStyle.minified.length > 0) {
        return forIndexFile.replace(
          '</head>',
          `<style>${mainStyle.minified}</style></head>`,
        );
      }
      return forIndexFile;
    } catch (e) {
      return forIndexFile;
    }
  }

  async injectPublicMainScript(forIndexFile: string) {
    try {
      const mainScript = await this.scriptService.findOne({ name: 'main' });

      if (mainScript.minified && mainScript.minified.length > 0) {
        return forIndexFile.replace(
          '</body>',
          `<script>${mainScript.minified}</script></body>`,
        );
      }
      return forIndexFile;
    } catch (e) {
      return forIndexFile;
    }
  }
  /**
   * Replaces characters in strings that are illegal/unsafe for filenames.
   * Unsafe characters are either removed or replaced by a substitute set
   * in the optional `options` object.
   *
   * Illegal Characters on Various Operating Systems
   * / ? < > \ : * | "
   * https://kb.acronis.com/content/39790
   *
   * Unicode Control codes
   * C0 0x00-0x1f & C1 (0x80-0x9f)
   * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
   *
   * Reserved filenames on Unix-based systems (".", "..")
   * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
   * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
   * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
   * "LPT9") case-insesitively and with or without filename extensions.
   *
   * Capped at 255 characters in length.
   * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
   *
   * @param  {String} input   Original filename
   * @param  {Object} options? {replacement: String}
   * @return {String}         Sanitized filename
   */
  sanitizeFilename(input: string, options?: FilenamifyOptions) {
    const replacement = (options && options.replacement) || '';
    const output = this.replace(input, replacement);
    if (replacement === '') {
      return output;
    }
    return this.replace(output, '');
  }

  shouldAttemptNextHandler(forUrl: string) {
    return forUrl === `/${configGql.url}` && configIsDev;
  }

  private replace(input: string, replacement: string) {
    const sanitized = input
      .replace(illegalRe, replacement)
      .replace(controlRe, replacement)
      .replace(reservedRe, replacement)
      .replace(windowsReservedRe, replacement)
      .replace(windowsTrailingRe, replacement);
    return truncate(sanitized, MAX_FILENAME_LENGTH);
  }
}
