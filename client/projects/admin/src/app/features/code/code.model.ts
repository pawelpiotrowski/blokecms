import { BlockCode } from 'shared-lib';

export class BlockCodeModel implements BlockCode {
  _id = '';
  name = '';
  code = '';
  lang = 'css';
  showLineNumbers = true;
}
