import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { BlockType } from '../block/block.interface';
import { AppSchemaId } from '../common/common.interface';

@ObjectType()
export class ArticleContent {
  @Field(() => ID)
  readonly refId: AppSchemaId;

  @Field(() => BlockType)
  readonly kind: BlockType;
}

@InputType()
export class ArticleContentInput {
  @Field(() => ID)
  readonly refId: AppSchemaId;

  @Field(() => BlockType)
  readonly kind: BlockType;
}
