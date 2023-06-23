import * as Chance from 'chance';
import { Types } from 'mongoose';
import { BlockType } from '../../src/block/block.interface';
import {
  BlockMediaCreateInput,
  BlockMediaInput,
} from '../../src/block/media/block-media.dto';

const chance = new Chance();

export const mockBlockMediaInput = (): BlockMediaInput => ({
  name: chance.name(),
  url: chance.url(),
  isPortrait: chance.bool(),
  isSquare: chance.bool(),
  naturalHeight: chance.natural(),
  naturalWidth: chance.natural(),
});

export const mockBlockMediaCreateInput = (): BlockMediaCreateInput => ({
  ...mockBlockMediaInput(),
  authorId: new Types.ObjectId().toString(),
  kind: BlockType.Media,
});
