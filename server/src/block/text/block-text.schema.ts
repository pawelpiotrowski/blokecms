import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Block } from '../block.schema';

/**
 * BlockText Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class BlockText extends Block {
  @Field(() => String)
  @Prop()
  text: string;

  @Field(() => String)
  @Prop()
  jsonDoc: string;

  @Field(() => String)
  @Prop()
  html: string;
}

export const BlockTextSchema = SchemaFactory.createForClass(BlockText);

export type BlockTextDocument = BlockText & Document;
