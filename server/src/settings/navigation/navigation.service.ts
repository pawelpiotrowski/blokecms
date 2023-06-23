import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSchemaId } from '../../common/common.interface';
import { PageService } from '../../page/page.service';
import {
  NavigationCreateInput,
  NavigationInputFilter,
  NavigationInputUpdate,
  NavigationItem,
  NavigationLink,
} from './navigation.dto';
import { Navigation, NavigationDocument } from './navigation.schema';

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name)
    private readonly navigationModel: Model<NavigationDocument>,
    private readonly pageService: PageService,
  ) {}

  async create(input: NavigationCreateInput) {
    return this.navigationModel.create(input);
  }

  async findAll() {
    return this.navigationModel.find().exec();
  }

  async findOne(filter: NavigationInputFilter) {
    return this.navigationModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.navigationModel.findByIdAndDelete(id).exec();
  }

  async update(input: NavigationInputUpdate): Promise<Navigation> {
    const { _id, ...navigationUpdateInput } = input;

    return this.navigationModel
      .findByIdAndUpdate(_id, navigationUpdateInput, { new: true })
      .exec();
  }

  async resolveLinks(navigation: Navigation): Promise<NavigationLink[]> {
    const resolved = [];
    for (const item of navigation.items) {
      const link = await this.resolveLink(item);

      if (link != null) {
        resolved.push(link);
      }
    }
    return resolved;
  }

  async resolveLink(item: NavigationItem): Promise<NavigationLink | null> {
    if (item.url || item.pageId == null) {
      return item;
    }

    const page = await this.pageService.getOne({ _id: item.pageId });
    const pageObject = page.toObject();

    if (pageObject && pageObject.slug) {
      return {
        ...item,
        slug: pageObject.slug,
      };
    }
    return null;
  }
}
