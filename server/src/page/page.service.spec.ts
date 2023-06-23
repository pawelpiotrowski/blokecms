import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockPageCreateInput } from '../../test/helpers/page.dto.helper';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/helpers/mongoose.helper';
import { PageService } from './page.service';
import { Page, PageSchema } from './page.schema';
import { Types } from 'mongoose';
import { AppSchemaId } from '../common/common.interface';
import { Article, ArticleSchema } from '../article/article.schema';

describe('PageService', () => {
  let service: PageService;
  let module: TestingModule;
  const createPageInput = mockPageCreateInput();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Page.name,
            schema: PageSchema,
          },
          {
            name: Article.name,
            schema: ArticleSchema,
          },
        ]),
      ],
      providers: [PageService],
    }).compile();

    service = module.get<PageService>(PageService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create a page with PageCreateInput', async () => {
      const createdPage = await service.create(createPageInput);

      expect(createdPage._id).toBeDefined();
      expect(createdPage.slug).toEqual(createPageInput.slug);
      expect(createdPage.title).toEqual(createPageInput.title);
      expect(createdPage.authorId.toString()).toEqual(createPageInput.authorId);
    });
  });

  describe('findAll', () => {
    it('should get a list of pages', async () => {
      const pages = await service.findAll();

      expect(pages).toBeDefined();
      expect(Array.isArray(pages)).toBe(true);
      expect(pages.length).toBe(1);
      expect(pages[0].slug).toBe(createPageInput.slug);
    });
  });

  describe('count', () => {
    it('should get a count of pages', async () => {
      const pages = await service.count();

      expect(pages).toBeDefined();
      expect(pages).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne, getOne', () => {
    it('should return a page if exists otherwise null', async () => {
      const createPage1Input = mockPageCreateInput();
      const createPage2Input = mockPageCreateInput();
      const createdPage1 = await service.create(createPage1Input);
      const createdPage2 = await service.create(createPage2Input);

      const page1FindOneById = await service.findOne({ _id: createdPage1._id });
      const page1FindOneBySlug = await service.findOne({
        slug: createdPage1.slug,
      });
      const page2FindOneById = await service.getOne({
        _id: createdPage2._id,
      });
      const page2FindOneBySlug = await service.findOne({
        slug: createdPage2.slug,
      });
      const pageNotFound = await service.getOne({
        slug: 'test',
      });

      expect(page1FindOneById.slug).toEqual(createdPage1.slug);
      expect(page1FindOneBySlug._id.toString()).toEqual(
        createdPage1._id.toString(),
      );
      expect(page2FindOneById.slug).toEqual(createdPage2.slug);
      expect(page2FindOneBySlug._id.toString()).toEqual(
        createdPage2._id.toString(),
      );
      expect(pageNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete page by id', async () => {
      const createdPage = await service.create(mockPageCreateInput());

      const pageFindOneById = await service.findOne({
        _id: createdPage._id,
      });
      expect(pageFindOneById._id).toBeDefined();

      await service.deleteOne(pageFindOneById._id);

      const pageFindOneByIdAfterDelete = await service.findOne({
        _id: createdPage._id,
      });
      expect(pageFindOneByIdAfterDelete).toEqual(null);
    });
  });

  describe('update', () => {
    it('should update page', async () => {
      const createdPage = await service.create(mockPageCreateInput());
      const mockUpdate = {
        _id: createdPage._id,
        slug: 'foo-bar',
        title: 'The Title',
        articles: [{ _id: new Types.ObjectId() }] as AppSchemaId[],
      };
      const updatedPage = await service.update(mockUpdate);
      const findUpdatedPage = await service.findOne({
        _id: createdPage._id,
      });
      expect(updatedPage.slug).toEqual(findUpdatedPage.slug);
      expect(findUpdatedPage.title).toEqual(mockUpdate.title);
      expect(updatedPage.articles.length).toEqual(mockUpdate.articles.length);
    });
  });

  describe('findManyByTitleOrSlug', () => {
    describe('with nothing found or empty query', () => {
      it('should return empty array', async () => {
        const result1 = await service.findManyByTitleOrSlug(
          '123456789987654321',
        );

        expect(result1).toEqual([]);

        const result2 = await service.findManyByTitleOrSlug('');

        expect(result2).toEqual([]);
      });
    });

    describe('with single character query', () => {
      it('should return array of page with title or slug that starts with character', async () => {
        const pageSuperHeroInput = {
          ...mockPageCreateInput(),
          title: 'Captain America',
          slug: 'genre/super-heros',
        };
        const pageCartoonHeroInput = {
          ...mockPageCreateInput(),
          title: 'Shaun the sheep',
          slug: 'foo',
        };
        const pageSuperHero = await service.create(pageSuperHeroInput);
        const pageCartoonHero = await service.create(pageCartoonHeroInput);
        const result1 = await service.findManyByTitleOrSlug('s');
        const result2 = await service.findManyByTitleOrSlug('g');
        const resultTitles = result1.map((item) => item.title);
        const resultSlugs = result2.map((item) => item.slug);

        // result for "s"
        expect(resultTitles).not.toContain(pageSuperHero.title);
        expect(resultTitles).toContain(pageCartoonHero.title);

        // result for "g"
        expect(resultSlugs).toContain(pageSuperHero.slug);
        expect(resultSlugs).not.toContain(pageCartoonHero.slug);

        // clean up for next test
        await service.deleteOne(pageSuperHero._id);
        await service.deleteOne(pageCartoonHero._id);
      });
    });

    describe('with more than 1 characters query', () => {
      it('should return array of page with title or slug that contains characters', async () => {
        const pageBlackSheepInput = {
          ...mockPageCreateInput(),
          title: 'Black Sheep',
          slug: 'bar',
        };
        const pageBadWolfInput = {
          ...mockPageCreateInput(),
          title: 'Bad Wolf',
          slug: 'thee-black-wolf',
        };
        const pageBlackSheep = await service.create(pageBlackSheepInput);
        const pageBadWolf = await service.create(pageBadWolfInput);

        const result1 = await service.findManyByTitleOrSlug('ee');
        const result2 = await service.findManyByTitleOrSlug('wol');
        const resultTitles = result1.map((item) => item.title);
        const resultSlugs = result2.map((item) => item.slug);

        // result for "ee"
        expect(resultTitles).toContain(pageBlackSheep.title);
        expect(resultTitles).toContain(pageBadWolf.title);

        // result for "wol"
        expect(resultSlugs).not.toContain(pageBlackSheep.slug);
        expect(resultSlugs).toContain(pageBadWolf.slug);

        // clean up for next test
        await service.deleteOne(pageBlackSheep._id);
        await service.deleteOne(pageBadWolf._id);
      });
    });
  });
});
