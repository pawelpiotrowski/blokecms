import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import {
  blockWebComponentClosingTagRegex,
  blockWebComponentOpeningTagRegex,
  inlineWebComponentClosingTagRegex,
  inlineWebComponentOpeningTagRegex,
  inputWebComponentBlockEndTag,
  inputWebComponentBlockStartTag,
  inputWebComponentEndTag,
  inputWebComponentStartTag,
} from './block-text.constants';
import {
  BlockTextCreateInput,
  BlockTextInputFilter,
  BlockTextInputUpdate,
} from './block-text.dto';
import { BlockText, BlockTextDocument } from './block-text.schema';

@Injectable()
export class BlockTextService {
  constructor(
    @InjectModel(BlockText.name)
    private readonly blockTextModel: Model<BlockTextDocument>,
  ) {}

  async create(input: BlockTextCreateInput) {
    return this.blockTextModel.create(input);
  }

  async findAll() {
    return this.blockTextModel.find().exec();
  }

  async count() {
    return this.blockTextModel.countDocuments().exec();
  }

  async findOne(filter: BlockTextInputFilter) {
    return this.blockTextModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.blockTextModel.findByIdAndDelete(id).exec();
  }

  async update(input: BlockTextInputUpdate): Promise<BlockText> {
    const { _id, ...blockUpdateInput } = input;

    return this.blockTextModel
      .findByIdAndUpdate(_id, blockUpdateInput, { new: true })
      .exec();
  }

  async findManyByName(name: RegExp) {
    return this.blockTextModel.find().where({ name }).exec();
  }

  includeWebComponentTags(block: BlockText) {
    const { html } = block;

    if (!inlineWebComponentOpeningTagRegex.test(html)) {
      return html;
    }
    return this.parseBlockHtml(html);
  }

  private parseBlockHtml(html: string): string {
    // Order is important
    // 1. replace block opening tags
    // 2. replace block closing tags
    // 3. replace inline opening tags
    // 4. replace inline closing tags
    return this.replaceInlineClosingTags(
      this.replaceInlineOpeningTags(
        this.replaceBlockClosingTags(this.replaceBlockOpeningTags(html)),
      ),
    );
  }

  private replaceInlineClosingTags(str: string): string {
    return this.replaceTags(
      str,
      inlineWebComponentClosingTagRegex,
      this.getClosingTag.bind(this),
      this.getInlineComponentClosingTagName.bind(this),
    );
  }

  private replaceInlineOpeningTags(str: string): string {
    return this.replaceTags(
      str,
      inlineWebComponentOpeningTagRegex,
      this.getOpeningTag.bind(this),
      this.getInlineComponentOpeningTagName.bind(this),
    );
  }

  private replaceBlockClosingTags(str: string): string {
    return this.replaceTags(
      str,
      blockWebComponentClosingTagRegex,
      this.getClosingTag.bind(this),
      this.getBlockComponentClosingTagName.bind(this),
    );
  }

  private replaceBlockOpeningTags(str: string): string {
    return this.replaceTags(
      str,
      blockWebComponentOpeningTagRegex,
      this.getOpeningTag.bind(this),
      this.getBlockComponentOpeningTagName.bind(this),
    );
  }

  private getOpeningTag(tagName: string): string {
    return this.getTag(tagName, true);
  }

  private getClosingTag(tagName: string): string {
    return this.getTag(tagName, false);
  }

  private getTag(tagName: string, isOpen: boolean): string {
    // add dash to all capital letters and lower case it
    let tag = tagName.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
    // most likely we had first letter as capital
    if (tag.startsWith('-')) {
      tag = tag.substring(1);
    }
    return isOpen ? `<${tag}>` : `</${tag}>`;
  }

  private replaceTags(
    str: string,
    regex: RegExp,
    getTag: (s: string) => string,
    getName: (s: string) => string,
  ): string {
    const tags = str.match(regex);

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        const replacement = getTag(getName(tag));

        str = str.replaceAll(tag, replacement);
      });
    }
    return str;
  }

  private getBlockComponentOpeningTagName(str: string): string {
    return this.replacer(
      str,
      inputWebComponentBlockStartTag,
      inputWebComponentBlockEndTag,
    );
  }

  private getBlockComponentClosingTagName(str: string): string {
    return this.replacer(
      str,
      `${inputWebComponentBlockStartTag}/`,
      inputWebComponentBlockEndTag,
    );
  }

  private getInlineComponentOpeningTagName(str: string): string {
    return this.replacer(
      str,
      inputWebComponentStartTag,
      inputWebComponentEndTag,
    );
  }

  private getInlineComponentClosingTagName(str: string): string {
    return this.replacer(
      str,
      `${inputWebComponentStartTag}/`,
      inputWebComponentEndTag,
    );
  }

  private replacer(str: string, r1: string, r2: string): string {
    return str.replace(r1, '').replace(r2, '');
  }
}
