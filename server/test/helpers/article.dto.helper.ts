import * as Chance from 'chance';
import { Types } from 'mongoose';
import {
  ArticleCreateInput,
  ArticleInput,
} from '../../src/article/article.dto';

const chance = new Chance();

export const mockArticleInput = (): ArticleInput => ({
  title: chance.word(),
  content: [],
});

export const mockArticleCreateInput = (): ArticleCreateInput => ({
  title: chance.word(),
  content: [],
  authorId: new Types.ObjectId().toString(),
});
