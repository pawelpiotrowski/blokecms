import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';
import { BlockCreateInput, BlockInput } from '../block.dto';
import { BlockText } from './block-text.schema';

@InputType()
export class BlockTextInput extends BlockInput {
  @Field(() => String)
  @IsNotEmpty()
  text: string;

  @Field(() => String)
  @IsNotEmpty()
  jsonDoc: string;

  @Field(() => String)
  @IsNotEmpty()
  html: string;
}

@InputType()
export class BlockTextInputUpdate extends PartialType(BlockTextInput) {
  @Field(() => ID)
  _id: AppSchemaId;
}

@InputType()
export class BlockTextInputFilter extends PartialType(BlockText, InputType) {}

/**
 * Internal
 * Used for passing authorId and block kind from resolver to service along with block input
 */
export interface BlockTextCreateInput
  extends BlockTextInput,
    BlockCreateInput {}
