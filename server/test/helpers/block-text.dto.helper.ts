import * as Chance from 'chance';
import { Types } from 'mongoose';
import { BlockType } from '../../src/block/block.interface';
import {
  BlockTextCreateInput,
  BlockTextInput,
} from '../../src/block/text/block-text.dto';

const chance = new Chance();

export const mockBlockTextInput = (): BlockTextInput => ({
  name: chance.name(),
  text: chance.paragraph(),
  jsonDoc: JSON.stringify({}),
  html: `<p>${chance.paragraph()}</p>`,
});

export const mockBlockTextCreateInput = (): BlockTextCreateInput => ({
  ...mockBlockTextInput(),
  authorId: new Types.ObjectId().toString(),
  kind: BlockType.Text,
});
