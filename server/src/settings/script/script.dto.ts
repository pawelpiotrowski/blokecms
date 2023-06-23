import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';

@InputType()
export class ScriptInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly name: string;

  @Field(() => String)
  @IsNotEmpty()
  readonly formatted: string;
}

/**
 * Internal
 * Used for passing authorId from resolver to service along with navigation input
 */
export class ScriptCreateInput extends ScriptInput {
  readonly authorId: AppSchemaId;
}

@InputType()
export class ScriptFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly formatted: string;
}

@InputType()
export class ScriptInputFilter extends PartialType(ScriptFilter, InputType) {}

@InputType()
export class ScriptInputUpdate extends ScriptInputFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;
}
