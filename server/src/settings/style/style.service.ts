import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import minify from '@node-minify/core';
import cleanCSS from '@node-minify/clean-css';
import {
  StyleCreateInput,
  StyleInputFilter,
  StyleInputUpdate,
} from './style.dto';
import { Style, StyleDocument } from './style.schema';
import { AppSchemaId } from '../../common/common.interface';

@Injectable()
export class StyleService {
  constructor(
    @InjectModel(Style.name)
    private readonly styleModel: Model<StyleDocument>,
  ) {}

  async create(input: StyleCreateInput) {
    const minified = await this.getMinified(input.formatted);

    return this.styleModel.create({ ...input, minified });
  }

  async update(input: StyleInputUpdate) {
    const { _id, ...styleUpdateInput } = input;
    const minified = await this.getMinified(styleUpdateInput.formatted);

    return this.styleModel
      .findByIdAndUpdate(_id, { ...styleUpdateInput, minified }, { new: true })
      .exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.styleModel.findByIdAndDelete(id).exec();
  }

  async findOne(filter: StyleInputFilter) {
    return this.styleModel.findOne(filter).exec();
  }

  async findAll() {
    return this.styleModel.find().exec();
  }

  private async getMinified(formatted: string) {
    try {
      const minified = await minify({
        compressor: cleanCSS,
        content: formatted,
      });
      return minified;
    } catch (e) {
      return '';
    }
  }
}
