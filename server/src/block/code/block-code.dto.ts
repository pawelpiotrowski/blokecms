import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';
import { BlockCreateInput, BlockInput } from '../block.dto';
import { BlockCodeLang } from './block-code.interface';
import { BlockCode } from './block-code.schema';

@InputType()
export class BlockCodeInput extends BlockInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly code: string;

  @Field(() => BlockCodeLang)
  readonly lang: BlockCodeLang;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  readonly showLineNumbers?: boolean;
}

@InputType()
export class BlockCodeInputUpdate extends PartialType(BlockCodeInput) {
  @Field(() => ID)
  _id: AppSchemaId;
}

@InputType()
export class BlockCodeInputFilter extends PartialType(BlockCode, InputType) {}

/**
 * Internal
 * Used for passing authorId and block kind from resolver to service along with block input
 */
export interface BlockCodeCreateInput
  extends BlockCodeInput,
    BlockCreateInput {}
