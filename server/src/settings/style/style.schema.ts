import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';

/**
 * Style Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class Style {
  @Field(() => ID)
  _id: AppSchemaId;

  @Field(() => String)
  @Prop({
    unique: true,
  })
  name: string;

  @Field(() => ID)
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  authorId: AppSchemaId;

  @Field(() => String)
  @Prop()
  formatted: string;

  @Field(() => String)
  @Prop()
  minified: string;
}

export const StyleSchema = SchemaFactory.createForClass(Style);

export type StyleDocument = Style & Document;
