import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';

@InputType()
export class StyleInput {
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
export class StyleCreateInput extends StyleInput {
  readonly authorId: AppSchemaId;
}

@InputType()
export class StyleFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly formatted: string;
}

@InputType()
export class StyleInputFilter extends PartialType(StyleFilter, InputType) {}

@InputType()
export class StyleInputUpdate extends StyleInputFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;
}
