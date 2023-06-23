import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import { mockUser } from '../../test/helpers/user.dto.helper';
import { Article } from './article.schema';
import { ArticleService } from './article.service';
import {
  articlesQueryResolver,
  articleQueryResolver,
  articleMutationResolver,
  ArticleResolver,
  articleTitleQueryResultResolver,
  articleBlocksQueryResultResolver,
  articlesCountQueryResolver,
} from './article.resolver';
import {
  mockArticleCreateInput,
  mockArticleInput,
} from '../../test/helpers/article.dto.helper';
import { BlocksQueryResultUnion } from '../block/block.dto';

jest.mock('./article.service');
jest.mock('../casl/casl.service');

describe('ArticleResolver', () => {
  let resolver: ArticleResolver;
  let articleService: ArticleService;
  let caslService: CaslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleResolver, ArticleService, CaslService],
    }).compile();

    resolver = module.get<ArticleResolver>(ArticleResolver);
    articleService = module.get<ArticleService>(ArticleService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('articles', () => {
    it('should call service findAll article', async () => {
      await resolver.articles();
      expect(articleService.findAll).toBeCalled();
      expect(articlesQueryResolver()).toEqual([Article]);
    });
  });

  describe('articlesCount', () => {
    it('should call service count articles', async () => {
      await resolver.articlesCount();
      expect(articleService.count).toBeCalled();
      expect(articlesCountQueryResolver()).toEqual(Number);
    });
  });

  describe('article', () => {
    describe('when article exits', () => {
      it('should return it', async () => {
        const mockInput = { title: 'bar' };
        const mockResolvedArticle = mockArticleCreateInput();
        (articleService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedArticle,
        );
        const result = await resolver.article(mockInput);

        expect(articleService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedArticle);
        expect(articleQueryResolver()).toEqual(Article);
      });
    });

    describe('when article does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { title: 'foo' };
        (articleService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.article(mockInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('Article not found'));
        }
      });
    });
  });

  describe('createArticle', () => {
    it('should call service create article passing input and user id as authorId', async () => {
      const articleInput = mockArticleInput();
      const user = mockUser();

      await resolver.createArticle(articleInput, user);
      expect(articleService.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        ...articleInput,
      });
      expect(articleMutationResolver()).toEqual(Article);
    });
  });

  describe('updateArticle', () => {
    describe('when article exists', () => {
      it('should call service update passing input', async () => {
        const updateArticleInput = {
          _id: new Types.ObjectId(),
          title: '123',
        };
        const mockReqUser = mockUser();
        const mockArticle = new Article();
        mockArticle.authorId = mockReqUser._id;
        (articleService.findOne as jest.Mock).mockResolvedValueOnce(
          mockArticle,
        );
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );

        await resolver.updateArticle(updateArticleInput, mockReqUser);

        expect(articleService.findOne).toHaveBeenLastCalledWith({
          _id: updateArticleInput._id,
        });
        expect(articleService.update).toHaveBeenLastCalledWith(
          updateArticleInput,
        );
        expect(articleMutationResolver()).toEqual(Article);
        expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
          mockReqUser,
          CaslAction.Update,
          mockArticle,
        );
      });
    });

    describe('when article does NOT exists', () => {
      it('should throw article not found', async () => {
        const updateArticleInput = {
          _id: new Types.ObjectId(),
          title: '321',
        };
        const mockReqUser = mockUser();
        const mockArticle = new Article();
        mockArticle.authorId = mockReqUser._id;
        (articleService.findOne as jest.Mock).mockResolvedValueOnce(null);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );
        expect.assertions(4);

        try {
          await resolver.updateArticle(updateArticleInput, mockReqUser);
        } catch (error) {
          expect(articleService.findOne).toHaveBeenLastCalledWith({
            _id: updateArticleInput._id,
          });
          expect(articleService.update).not.toHaveBeenCalled();
          expect(articleMutationResolver()).toEqual(Article);
          expect(caslService.hasAbilityOrThrow).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('deleteArticle', () => {
    it('should call service delete article passing article id if allowed by ability check', async () => {
      const mockArticleId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockArticle = new Article();
      mockArticle.authorId = mockReqUser._id;
      (articleService.findOne as jest.Mock).mockResolvedValueOnce(mockArticle);
      (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await resolver.deleteArticle(mockArticleId, mockReqUser);

      expect(articleService.deleteOne).toHaveBeenLastCalledWith(mockArticleId);
      expect(articleService.findOne).toHaveBeenLastCalledWith({
        _id: mockArticleId,
      });
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockArticle,
      );
    });
  });

  describe('findArticlesByTitle', () => {
    it('should call service passing query', async () => {
      (articleService.findManyByTitle as jest.Mock).mockResolvedValueOnce([]);
      const result = await resolver.findArticlesByTitle('hello');

      expect(articleService.findManyByTitle).toHaveBeenLastCalledWith('hello');
      expect(result).toEqual([]);
      expect(articleTitleQueryResultResolver()).toEqual([Article]);
    });
  });

  describe('blocks', () => {
    it('should call service passing article', async () => {
      (articleService.resolveBlocks as jest.Mock).mockResolvedValueOnce([]);
      const mockArticle = mockArticleInput();
      const result = await resolver.blocks(mockArticle as any);

      expect(articleService.resolveBlocks).toHaveBeenLastCalledWith(
        mockArticle,
      );
      expect(result).toEqual([]);
      expect(articleBlocksQueryResultResolver()).toEqual([
        BlocksQueryResultUnion,
      ]);
    });
  });
});
