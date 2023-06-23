import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises } from 'fs';
import { join } from 'path';
import { AppSchemaId } from '../../common/common.interface';
import {
  BlockMediaCreateInput,
  BlockMediaInputFilter,
  BlockMediaInputUpdate,
} from './block-media.dto';
import { BlockMedia, BlockMediaDocument } from './block-media.schema';
import { uploadFileInterceptorForDiskStorage } from '../../upload/upload.constants';

@Injectable()
export class BlockMediaService {
  constructor(
    @InjectModel(BlockMedia.name)
    private readonly blockMediaModel: Model<BlockMediaDocument>,
  ) {}

  async create(input: BlockMediaCreateInput) {
    return this.blockMediaModel.create(input);
  }

  async findAll() {
    return this.blockMediaModel.find().exec();
  }

  async count() {
    return this.blockMediaModel.countDocuments().exec();
  }

  async findOne(filter: BlockMediaInputFilter) {
    return this.blockMediaModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    const deleted = await this.blockMediaModel.findByIdAndDelete(id).exec();

    if (deleted && deleted.url) {
      const filePath = join(
        process.cwd(),
        uploadFileInterceptorForDiskStorage.destination as string,
        deleted.url,
      );
      await promises.unlink(filePath);
    }

    return deleted;
  }

  async update(input: BlockMediaInputUpdate): Promise<BlockMedia> {
    const { _id, ...blockUpdateInput } = input;

    return this.blockMediaModel
      .findByIdAndUpdate(_id, blockUpdateInput, { new: true })
      .exec();
  }

  async findManyByName(name: RegExp) {
    return this.blockMediaModel.find().where({ name }).exec();
  }
}
