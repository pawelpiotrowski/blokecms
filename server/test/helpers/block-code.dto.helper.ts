import * as Chance from 'chance';
import { Types } from 'mongoose';
import { BlockType } from '../../src/block/block.interface';
import {
  BlockCodeCreateInput,
  BlockCodeInput,
} from '../../src/block/code/block-code.dto';
import { BlockCodeLang } from '../../src/block/code/block-code.interface';

const chance = new Chance();

export const mockBlockCodeInput = (
  code: string,
  lang: BlockCodeLang,
): BlockCodeInput => ({
  name: chance.name(),
  code,
  lang,
  showLineNumbers: chance.bool(),
});

export const mockBlockCodeCreateInput = (
  code: string,
  lang: BlockCodeLang,
): BlockCodeCreateInput => ({
  ...mockBlockCodeInput(code, lang),
  authorId: new Types.ObjectId().toString(),
  kind: BlockType.Code,
});
