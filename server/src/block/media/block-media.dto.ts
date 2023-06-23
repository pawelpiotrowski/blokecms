import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';
import { BlockCreateInput, BlockInput } from '../block.dto';
import { BlockMedia } from './block-media.schema';

@InputType()
export class BlockMediaInput extends BlockInput {
  @Field(() => String)
  @IsNotEmpty()
  url: string;

  @Field(() => Boolean)
  @IsBoolean()
  isPortrait: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  isSquare: boolean;

  @Field(() => Number)
  @IsNumber()
  naturalHeight: number;

  @Field(() => Number)
  @IsNumber()
  naturalWidth: number;
}

@InputType()
export class BlockMediaInputUpdate extends PartialType(BlockMediaInput) {
  @Field(() => ID)
  _id: AppSchemaId;
}

@InputType()
export class BlockMediaInputFilter extends PartialType(BlockMedia, InputType) {}

/**
 * Internal
 * Used for passing authorId and block kind from resolver to service along with block input
 */
export interface BlockMediaCreateInput
  extends BlockMediaInput,
    BlockCreateInput {}
