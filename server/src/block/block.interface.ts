import { registerEnumType } from '@nestjs/graphql';
import { BlockCode } from './code/block-code.schema';
import { BlockMedia } from './media/block-media.schema';
import { BlockText } from './text/block-text.schema';

export enum BlockType {
  Text = 'text',
  Media = 'media',
  Code = 'code',
}

registerEnumType(BlockType, {
  name: 'BlockType',
});

export type BlockUnion = BlockText | BlockMedia | BlockCode;
