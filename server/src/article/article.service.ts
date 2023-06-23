import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockType } from '../block/block.interface';
import { BlockCode } from '../block/code/block-code.schema';
import { BlockCodeService } from '../block/code/block-code.service';
import { BlockMedia } from '../block/media/block-media.schema';
import { BlockMediaService } from '../block/media/block-media.service';
import { BlockText } from '../block/text/block-text.schema';
import { BlockTextService } from '../block/text/block-text.service';
import { AppSchemaId } from '../common/common.interface';
import { ArticleContent } from './article-content.dto';
import {
  ArticleCreateInput,
  ArticleInputFilter,
  ArticleInputUpdate,
} from './article.dto';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private blockTextService: BlockTextService,
    private blockMediaService: BlockMediaService,
    private blockCodeService: BlockCodeService,
  ) {}

  async create(input: ArticleCreateInput) {
    return this.articleModel.create(input);
  }

  async findAll() {
    return this.articleModel.find().exec();
  }

  async count() {
    return this.articleModel.countDocuments().exec();
  }

  async findOne(filter: ArticleInputFilter) {
    return this.articleModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  async update(input: ArticleInputUpdate): Promise<Article> {
    const { _id, ...pageUpdateInput } = input;

    return this.articleModel
      .findByIdAndUpdate(_id, pageUpdateInput, { new: true })
      .exec();
  }

  async findManyByTitle(title: string) {
    const sanitizeTitle = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

    if (sanitizeTitle.length < 1) {
      return [];
    }
    // regex reference: https://github.com/scopsy/nestjs-monorepo-starter/blob/903cda1938c400e947f60d68595fb22ca7ea2795/apps/api/src/app/shared/crud/mongoose-crud.service.ts
    const titleRegex =
      sanitizeTitle.length === 1
        ? // name starts with
          new RegExp(`^${sanitizeTitle}`, 'i')
        : // name contains
          new RegExp(`${sanitizeTitle}`, 'i');

    return this.articleModel.find().where({ title: titleRegex }).exec();
  }

  async resolveBlocks(
    article: Article,
  ): Promise<Array<BlockMedia | BlockText | BlockCode>> {
    const resolved = [];
    for (const item of article.content) {
      const block = await this.getResolvedBlock(item);

      if (block != null) {
        resolved.push({ ...block });
      }
    }
    return resolved;
  }

  private async getResolvedBlock(
    item: ArticleContent,
  ): Promise<BlockMedia | BlockText | BlockCode> {
    let blockItem = null;

    switch (item.kind) {
      case BlockType.Media:
        blockItem = await this.blockMediaService.findOne({ _id: item.refId });
        break;
      case BlockType.Text:
        blockItem = await this.blockTextService.findOne({ _id: item.refId });
        break;
      case BlockType.Code:
        blockItem = await this.blockCodeService.findOne({ _id: item.refId });
        break;
    }
    return blockItem && blockItem.toObject ? blockItem.toObject() : null;
  }
}
