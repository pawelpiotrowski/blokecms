import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSchemaId } from '../common/common.interface';
import { PageCreateInput, PageInputFilter, PageInputUpdate } from './page.dto';
import { Page, PageDocument } from './page.schema';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>,
  ) {}

  async create(input: PageCreateInput) {
    return this.pageModel.create(input);
  }

  async findAll() {
    return this.pageModel.find().exec();
  }

  async findOne(filter: PageInputFilter) {
    return this.pageModel.findOne(filter).populate('articles').exec();
  }

  async getOne(filter: PageInputFilter) {
    return this.pageModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.pageModel.findByIdAndDelete(id).exec();
  }

  async update(input: PageInputUpdate): Promise<Page> {
    const { _id, ...pageUpdateInput } = input;

    return this.pageModel
      .findByIdAndUpdate(_id, pageUpdateInput, { new: true })
      .exec();
  }

  async findManyByTitleOrSlug(arg: string) {
    const sanitizeArg = arg.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '');

    if (sanitizeArg.length < 1) {
      return [];
    }
    // regex reference: https://github.com/scopsy/nestjs-monorepo-starter/blob/903cda1938c400e947f60d68595fb22ca7ea2795/apps/api/src/app/shared/crud/mongoose-crud.service.ts
    const argRegex =
      sanitizeArg.length === 1
        ? // name starts with
          new RegExp(`^${sanitizeArg}`, 'i')
        : // name contains
          new RegExp(`${sanitizeArg}`, 'i');

    return this.pageModel
      .find()
      .where({ $or: [{ title: argRegex }, { slug: argRegex }] })
      .exec();
  }

  async count() {
    return this.pageModel.countDocuments().exec();
  }
}
