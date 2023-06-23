import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';

/**
 * Script Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class Script {
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

export const ScriptSchema = SchemaFactory.createForClass(Script);

export type ScriptDocument = Script & Document;
