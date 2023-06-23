import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import {
  BlockCodeCreateInput,
  BlockCodeInputFilter,
  BlockCodeInputUpdate,
} from './block-code.dto';
import { BlockCode, BlockCodeDocument } from './block-code.schema';

@Injectable()
export class BlockCodeService {
  constructor(
    @InjectModel(BlockCode.name)
    private readonly blockCodeModel: Model<BlockCodeDocument>,
  ) {}

  async create(input: BlockCodeCreateInput) {
    return this.blockCodeModel.create(input);
  }

  async findAll() {
    return this.blockCodeModel.find().exec();
  }

  async count() {
    return this.blockCodeModel.countDocuments().exec();
  }

  async findOne(filter: BlockCodeInputFilter) {
    return this.blockCodeModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.blockCodeModel.findByIdAndDelete(id).exec();
  }

  async update(input: BlockCodeInputUpdate): Promise<BlockCode> {
    const { _id, ...blockUpdateInput } = input;

    return this.blockCodeModel
      .findByIdAndUpdate(_id, blockUpdateInput, { new: true })
      .exec();
  }

  async findManyByName(name: RegExp) {
    return this.blockCodeModel.find().where({ name }).exec();
  }
}
