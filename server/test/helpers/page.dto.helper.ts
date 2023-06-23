import * as Chance from 'chance';
import { Types } from 'mongoose';
import { PageCreateInput, PageInput } from '../../src/page/page.dto';

const chance = new Chance();

export const mockPageInput = (): PageInput => ({
  slug: chance.word(),
  title: chance.name(),
});

export const mockPageCreateInput = (): PageCreateInput => ({
  slug: chance.word(),
  title: chance.name(),
  authorId: new Types.ObjectId().toString(),
});
