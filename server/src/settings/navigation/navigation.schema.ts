import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';
import { NavigationItem } from './navigation.dto';

/**
 * Navigation Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema()
export class Navigation {
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

  @Field(() => [NavigationItem])
  @Prop(raw([NavigationItem]))
  items: NavigationItem[];
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation);

export type NavigationDocument = Navigation & Document;
