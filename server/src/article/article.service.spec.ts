import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockArticleCreateInput } from '../../test/helpers/article.dto.helper';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/helpers/mongoose.helper';
import { BlockType } from '../block/block.interface';
import { BlockCodeService } from '../block/code/block-code.service';
import { BlockMediaService } from '../block/media/block-media.service';
import { BlockTextService } from '../block/text/block-text.service';
import { Article, ArticleSchema } from './article.schema';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let blockTextService: BlockTextService;
  let blockMediaService: BlockMediaService;
  let blockCodeService: BlockCodeService;
  let module: TestingModule;

  const createArticleInput = mockArticleCreateInput();
  const mockBlockTextService = {
    findOne: jest.fn(),
  };
  const mockBlockMediaService = {
    findOne: jest.fn(),
  };
  const mockBlockCodeService = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Article.name,
            schema: ArticleSchema,
          },
        ]),
      ],
      providers: [
        ArticleService,
        { provide: BlockTextService, useValue: mockBlockTextService },
        { provide: BlockMediaService, useValue: mockBlockMediaService },
        { provide: BlockCodeService, useValue: mockBlockCodeService },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    blockTextService = module.get<BlockTextService>(BlockTextService);
    blockMediaService = module.get<BlockMediaService>(BlockMediaService);
    blockCodeService = module.get<BlockCodeService>(BlockCodeService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create article with ArticleCreateInput', async () => {
      const createdArticle = await service.create(createArticleInput);

      expect(createdArticle._id).toBeDefined();
      expect(createdArticle.title).toEqual(createArticleInput.title);
      expect(createdArticle.authorId.toString()).toEqual(
        createArticleInput.authorId,
      );
    });
  });

  describe('findAll', () => {
    it('should get a list of articles', async () => {
      const articles = await service.findAll();

      expect(articles).toBeDefined();
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(1);
      expect(articles[0].title).toBe(createArticleInput.title);
    });
  });

  describe('count', () => {
    it('should get a count of articles', async () => {
      const articles = await service.count();

      expect(articles).toBeDefined();
      expect(articles).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne', () => {
    it('should return article if exists otherwise null', async () => {
      const createArticle1Input = mockArticleCreateInput();
      const createArticle2Input = mockArticleCreateInput();
      const createdArticle1 = await service.create(createArticle1Input);
      const createdArticle2 = await service.create(createArticle2Input);

      const article1FindOneById = await service.findOne({
        _id: createdArticle1._id,
      });
      const article1FindOneByTitle = await service.findOne({
        title: createdArticle1.title,
      });
      const article2FindOneById = await service.findOne({
        _id: createdArticle2._id,
      });
      const article2FindOneByTitle = await service.findOne({
        title: createdArticle2.title,
      });
      const aricleNotFound = await service.findOne({
        title: 'test',
      });

      expect(article1FindOneById.title).toEqual(createdArticle1.title);
      expect(article1FindOneByTitle._id.toString()).toEqual(
        createdArticle1._id.toString(),
      );
      expect(article2FindOneById.title).toEqual(createdArticle2.title);
      expect(article2FindOneByTitle._id.toString()).toEqual(
        createdArticle2._id.toString(),
      );
      expect(aricleNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete article by id', async () => {
      const createdArticle = await service.create(mockArticleCreateInput());

      const articleFindOneById = await service.findOne({
        _id: createdArticle._id,
      });
      expect(articleFindOneById._id).toBeDefined();

      await service.deleteOne(articleFindOneById._id);

      const articleFindOneByIdAfterDelete = await service.findOne({
        _id: createdArticle._id,
      });
      expect(articleFindOneByIdAfterDelete).toEqual(null);
    });
  });

  describe('update', () => {
    it('should update article', async () => {
      const createdArticle = await service.create(mockArticleCreateInput());
      const mockUpdate = {
        _id: createdArticle._id,
        title: 'The Title',
        content: [{ refId: new Types.ObjectId(), kind: BlockType.Media }],
      };
      const updatedArticle = await service.update(mockUpdate);
      const findUpdatedArticle = await service.findOne({
        _id: createdArticle._id,
      });
      expect(updatedArticle.title).toEqual(findUpdatedArticle.title);
      expect(findUpdatedArticle.title).toEqual(mockUpdate.title);
      expect(updatedArticle.content.length).toEqual(mockUpdate.content.length);
    });
  });

  describe('findManyByTitle', () => {
    let articleSearch1;
    let articleSearch2;
    let articleSearch3;
    const articleSearch1Input = { ...mockArticleCreateInput() };
    articleSearch1Input.title = 'Captain America';
    const articleSearch2Input = { ...mockArticleCreateInput() };
    articleSearch2Input.title = 'Shaun the sheep';
    const articleSearch3Input = { ...mockArticleCreateInput() };
    articleSearch3Input.title = 'Thee Title';

    beforeAll(async () => {
      articleSearch1 = await service.create(articleSearch1Input);
      articleSearch2 = await service.create(articleSearch2Input);
      articleSearch3 = await service.create(articleSearch3Input);
    });

    describe('with nothing found or empty query', () => {
      it('should return empty array', async () => {
        const result1 = await service.findManyByTitle('123456789987654321');

        expect(result1).toEqual([]);

        const result2 = await service.findManyByTitle('');

        expect(result2).toEqual([]);
      });
    });

    describe('with single character query', () => {
      it('should return array of articles with title that starts with character', async () => {
        const result = await service.findManyByTitle('s');
        const resultTitles = result.map((item) => item.title);

        expect(resultTitles).not.toContain(articleSearch1.title);
        expect(resultTitles).toContain(articleSearch2.title);
        expect(resultTitles).not.toContain(articleSearch3.title);
      });
    });

    describe('with more than 1 characters query', () => {
      it('should return array of articles with title that contains characters', async () => {
        const result = await service.findManyByTitle('ee');
        const resultTitles = result.map((item) => item.title);

        expect(resultTitles).not.toContain(articleSearch1.title);
        expect(resultTitles).toContain(articleSearch2.title);
        expect(resultTitles).toContain(articleSearch3.title);
      });
    });
  });

  describe('resolveBlocks', () => {
    it('should return article content resolved to blocks', async () => {
      const createdArticle = await service.create(mockArticleCreateInput());
      const mockArticleMediaContent = {
        refId: new Types.ObjectId(),
        kind: BlockType.Media,
      };
      const mockArticleTextContent = {
        refId: new Types.ObjectId(),
        kind: BlockType.Text,
      };
      const mockArticleCodeContent = {
        refId: new Types.ObjectId(),
        kind: BlockType.Code,
      };
      const mockArticleCodeContentSkipped = {
        refId: new Types.ObjectId(),
        kind: BlockType.Code,
      };
      const mockArticleMediaContentSkipped = {
        refId: new Types.ObjectId(),
        kind: BlockType.Media,
      };
      const mockOkMedia = { ok: 'media' };
      const mockOkText = { ok: 'text' };
      const mockOkCode = { ok: 'code' };
      const mockMediaResolvedValue = {
        toObject: jest.fn().mockReturnValue(mockOkMedia),
      };
      const mockTextResolvedValue = {
        toObject: jest.fn().mockReturnValue(mockOkText),
      };
      const mockCodeResolvedValue = {
        toObject: jest.fn().mockReturnValue(mockOkCode),
      };
      const mockNullResolvedValue = {
        toObject: jest.fn().mockReturnValue(null),
      };

      createdArticle.content.push(
        ...[
          mockArticleMediaContent,
          mockArticleTextContent,
          mockArticleCodeContent,
          mockArticleCodeContentSkipped,
          mockArticleMediaContentSkipped,
        ],
      );

      (blockMediaService.findOne as jest.Mock)
        .mockResolvedValueOnce(mockMediaResolvedValue)
        .mockResolvedValueOnce(mockNullResolvedValue);

      (blockTextService.findOne as jest.Mock).mockResolvedValueOnce(
        mockTextResolvedValue,
      );
      (blockCodeService.findOne as jest.Mock)
        .mockResolvedValueOnce(mockCodeResolvedValue)
        .mockResolvedValueOnce(null);

      const blocks = await service.resolveBlocks(createdArticle);

      expect(blocks).toEqual([mockOkMedia, mockOkText, mockOkCode]);
      expect(blockMediaService.findOne).toHaveBeenCalledTimes(2);
      expect(blockMediaService.findOne).toHaveBeenNthCalledWith(1, {
        _id: mockArticleMediaContent.refId,
      });
      expect(blockMediaService.findOne).toHaveBeenNthCalledWith(2, {
        _id: mockArticleMediaContentSkipped.refId,
      });
      expect(blockTextService.findOne).toHaveBeenCalledTimes(1);
      expect(blockTextService.findOne).toHaveBeenLastCalledWith({
        _id: mockArticleTextContent.refId,
      });
      expect(blockCodeService.findOne).toHaveBeenCalledTimes(2);
      expect(blockCodeService.findOne).toHaveBeenNthCalledWith(1, {
        _id: mockArticleCodeContent.refId,
      });
      expect(mockMediaResolvedValue.toObject).toHaveBeenCalled();
      expect(mockTextResolvedValue.toObject).toHaveBeenCalled();
      expect(mockCodeResolvedValue.toObject).toHaveBeenCalled();
      expect(mockNullResolvedValue.toObject).toHaveBeenCalled();
    });
  });
});
