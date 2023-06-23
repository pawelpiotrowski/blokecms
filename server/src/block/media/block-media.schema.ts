import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Block } from '../block.schema';

/**
 * BlockMedia Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class BlockMedia extends Block {
  @Field(() => String)
  @Prop()
  url: string;

  @Field(() => Boolean)
  @Prop()
  isPortrait: boolean;

  @Field(() => Boolean)
  @Prop()
  isSquare: boolean;

  @Field(() => Number)
  @Prop()
  naturalHeight: number;

  @Field(() => Number)
  @Prop()
  naturalWidth: number;
}

export const BlockMediaSchema = SchemaFactory.createForClass(BlockMedia);

export type BlockMediaDocument = BlockMedia & Document;
