import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Block } from '../block.schema';
import { BlockCodeLang } from './block-code.interface';

/**
 * BlockCode Schema and GraphQL DTO Object
 */
@ObjectType()
@Schema({ timestamps: true })
export class BlockCode extends Block {
  @Field(() => String)
  @Prop()
  code: string;

  @Field(() => BlockCodeLang)
  @Prop({
    type: String,
    enum: Object.keys(BlockCodeLang)
      .map((k) => BlockCodeLang[k])
      .map((v) => v),
  })
  lang: BlockCodeLang;

  @Field(() => Boolean)
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  showLineNumbers?: boolean;
}

export const BlockCodeSchema = SchemaFactory.createForClass(BlockCode);

export type BlockCodeDocument = BlockCode & Document;
