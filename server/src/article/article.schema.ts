import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AppSchemaId } from '../common/common.interface';
import { User } from '../user/user.schema';
import { ArticleContent } from './article-content.dto';

/**
 * Article Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class Article {
  @Field(() => ID)
  _id: AppSchemaId;

  @Field(() => ID)
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  authorId: AppSchemaId;

  @Field(() => String)
  @Prop()
  title: string;

  @Field(() => [ArticleContent])
  @Prop(raw([ArticleContent]))
  content: ArticleContent[];

  /**
   * Here just field for graphql since property has been declared within `@Schema()`.
   * Autogenerated by mongo
   */
  @Field()
  readonly createdAt: Date;

  /**
   * Here just field for graphql since property has been declared within `@Schema()`.
   * Autogenerated by mongo
   */
  @Field()
  readonly updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

export type ArticleDocument = Article & Document;
