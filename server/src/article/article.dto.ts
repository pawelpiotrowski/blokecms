import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { AppSchemaId } from '../common/common.interface';
import { ArticleContentInput } from './article-content.dto';

@InputType()
export class ArticleInput {
  @Field(() => String)
  @IsNotEmpty()
  readonly title: string;

  @Field(() => [ArticleContentInput])
  @IsArray()
  readonly content: ArticleContentInput[];
}

/**
 * Internal
 * Used for passing authorId from resolver to service along with article input
 */
export class ArticleCreateInput extends ArticleInput {
  readonly authorId: AppSchemaId;
}

@InputType()
export class ArticleFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => ID)
  readonly authorId: AppSchemaId;

  @Field(() => String)
  readonly title: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

@InputType()
export class ArticleInputFilter extends PartialType(ArticleFilter, InputType) {}

@InputType()
export class ArticleInputUpdate extends ArticleInputFilter {
  @Field(() => ID)
  readonly _id: AppSchemaId;

  @Field(() => [ArticleContentInput])
  @IsArray()
  @IsOptional()
  readonly content?: ArticleContentInput[];
}
