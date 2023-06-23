import { InputType, Field, createUnionType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AppSchemaId } from '../common/common.interface';
import { BlockType } from './block.interface';
import { BlockCode } from './code/block-code.schema';
import { BlockMedia } from './media/block-media.schema';
import { BlockText } from './text/block-text.schema';

@InputType({ isAbstract: true })
export abstract class BlockInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
}

/**
 * Internal
 * Used for passing authorId and kind from resolver to service along with block input
 */
export class BlockCreateInput {
  readonly authorId: AppSchemaId;
  readonly kind: BlockType;
}

export const BlocksQueryResultUnion = createUnionType({
  name: 'BlocksQueryResultUnion',
  types: () => [BlockText, BlockMedia, BlockCode] as const,
  resolveType(value) {
    if (value.url) {
      return BlockMedia;
    }
    if (value.text) {
      return BlockText;
    }
    if (value.code) {
      return BlockCode;
    }
    return null;
  },
});
