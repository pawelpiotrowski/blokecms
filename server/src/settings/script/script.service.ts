import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import minify from '@node-minify/core';
import uglifyJs from '@node-minify/uglify-js';
import { Model } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import {
  ScriptCreateInput,
  ScriptInputFilter,
  ScriptInputUpdate,
} from './script.dto';
import { Script, ScriptDocument } from './script.schema';

@Injectable()
export class ScriptService {
  constructor(
    @InjectModel(Script.name)
    private readonly scriptModel: Model<ScriptDocument>,
  ) {}

  async create(input: ScriptCreateInput) {
    const minified = await this.getMinified(input.formatted);

    return this.scriptModel.create({ ...input, minified });
  }

  async update(input: ScriptInputUpdate) {
    const { _id, ...scriptUpdateInput } = input;
    const minified = await this.getMinified(scriptUpdateInput.formatted);

    return this.scriptModel
      .findByIdAndUpdate(_id, { ...scriptUpdateInput, minified }, { new: true })
      .exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.scriptModel.findByIdAndDelete(id).exec();
  }

  async findOne(filter: ScriptInputFilter) {
    return this.scriptModel.findOne(filter).exec();
  }

  async findAll() {
    return this.scriptModel.find().exec();
  }

  private async getMinified(formatted: string) {
    try {
      const minified = await minify({
        compressor: uglifyJs,
        content: formatted,
      });
      return minified;
    } catch (e) {
      return '';
    }
  }
}
