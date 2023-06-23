import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { AppSchemaId } from '../common/common.interface';

const slugRegex = /^[A-Za-z0-9_\/-]*$/;

@InputType()
export class PageInput {
  @Field(() => String)
  @IsNotEmpty()
  @Matches(slugRegex)
  readonly slug: string;

  @Field(() => String)
  @IsNotEmpty()
  readonly title: string;
}

/**
 * Internal
 * Used for passing authorId from resolver to service along with page input
 */
export class PageCreateInput extends PageInput {
  readonly authorId: AppSchemaId;
}

@InputType()
class PageFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => ID)
  readonly authorId: AppSchemaId;

  @Field(() => String)
  @Matches(slugRegex)
  readonly slug: string;

  @Field(() => String)
  readonly title: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

@InputType()
export class PageInputFilter extends PartialType(PageFilter, InputType) {}

@InputType()
export class PageInputUpdate extends PageInputFilter {
  @Field(() => ID)
  _id: AppSchemaId;

  @Field(() => [ID])
  @IsOptional()
  articles?: AppSchemaId[];
}
