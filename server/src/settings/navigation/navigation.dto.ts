import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { AppSchemaId } from '../../common/common.interface';

@ObjectType()
export class NavigationItem {
  @Field(() => String)
  readonly label: string;

  @Field(() => ID, { nullable: true })
  readonly pageId?: AppSchemaId;

  @Field(() => String, { nullable: true })
  readonly url?: string;
}

@ObjectType()
export class NavigationLink extends NavigationItem {
  @Field(() => String, { nullable: true })
  readonly slug?: string;
}

@InputType()
export class NavigationItemInput {
  @Field(() => String)
  readonly label: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  readonly pageId?: AppSchemaId;

  @Field(() => String, { nullable: true })
  @IsOptional()
  readonly url?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  readonly slug?: string;
}

@InputType()
export class NavigationInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly name: string;

  @Field(() => [NavigationItemInput])
  @IsArray()
  readonly items: NavigationItemInput[];
}

@InputType()
export class NavigationFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => String)
  readonly name: string;
}

/**
 * Internal
 * Used for passing authorId from resolver to service along with navigation input
 */
export class NavigationCreateInput extends NavigationInput {
  readonly authorId: AppSchemaId;
}

@InputType()
export class NavigationInputFilter extends PartialType(
  NavigationFilter,
  InputType,
) {}

@InputType()
export class NavigationInputUpdate extends NavigationInputFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => [NavigationItemInput])
  @IsArray()
  @IsOptional()
  readonly items?: NavigationItemInput[];
}
