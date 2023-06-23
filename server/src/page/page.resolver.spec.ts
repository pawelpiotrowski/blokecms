import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CaslService } from '../casl/casl.service';
import {
  mockPageCreateInput,
  mockPageInput,
} from '../../test/helpers/page.dto.helper';
import { mockUser } from '../../test/helpers/user.dto.helper';
import {
  pageMutationResolver,
  pageQueryResolver,
  PageResolver,
  pagesCountQueryResolver,
  pagesQueryResolver,
  pageTitleOrSlugQueryResultResolver,
} from './page.resolver';
import { Page } from './page.schema';
import { PageService } from './page.service';
import { CaslAction } from '../casl/casl.interface';
import { NotFoundException } from '@nestjs/common';

jest.mock('./page.service');
jest.mock('../casl/casl.service');

describe('PageResolver', () => {
  let resolver: PageResolver;
  let pageService: PageService;
  let caslService: CaslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageResolver, PageService, CaslService],
    }).compile();

    resolver = module.get<PageResolver>(PageResolver);
    pageService = module.get<PageService>(PageService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('pages', () => {
    it('should call service findAll pages', async () => {
      await resolver.pages();
      expect(pageService.findAll).toBeCalled();
      expect(pagesQueryResolver()).toEqual([Page]);
    });
  });

  describe('pagesCount', () => {
    it('should call service count pages', async () => {
      await resolver.pagesCount();
      expect(pageService.count).toBeCalled();
      expect(pagesCountQueryResolver()).toEqual(Number);
    });
  });

  describe('page', () => {
    describe('when page exits', () => {
      it('should return it', async () => {
        const mockInput = { slug: 'bar' };
        const mockResolvedPage = mockPageCreateInput();
        (pageService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedPage,
        );
        const result = await resolver.page(mockInput);

        expect(pageService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedPage);
        expect(pageQueryResolver()).toEqual(Page);
      });
    });

    describe('when page does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { slug: 'foo' };
        (pageService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.page(mockInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('Page not found'));
        }
      });
    });
  });

  describe('createPage', () => {
    it('should call service create page passing input and user id as authorId', async () => {
      const pageInput = mockPageInput();
      const user = mockUser();

      await resolver.createPage(pageInput, user);
      expect(pageService.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        ...pageInput,
      });
      expect(pageMutationResolver()).toEqual(Page);
    });
  });

  describe('updatePage', () => {
    describe('when page exists', () => {
      it('should call service update passing input', async () => {
        const updatePageInput = {
          _id: new Types.ObjectId(),
          slug: 'foo',
          title: '123',
        };
        const mockReqUser = mockUser();
        const mockPage = new Page();
        mockPage.authorId = mockReqUser._id;
        (pageService.findOne as jest.Mock).mockResolvedValueOnce(mockPage);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );

        await resolver.updatePage(updatePageInput, mockReqUser);

        expect(pageService.findOne).toHaveBeenLastCalledWith({
          _id: updatePageInput._id,
        });
        expect(pageService.update).toHaveBeenLastCalledWith(updatePageInput);
        expect(pageMutationResolver()).toEqual(Page);
        expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
          mockReqUser,
          CaslAction.Update,
          mockPage,
        );
      });
    });
    describe('when page does NOT exists', () => {
      it('should throw page not found', async () => {
        const updatePageInput = {
          _id: new Types.ObjectId(),
          slug: 'bar',
          title: '321',
        };
        const mockReqUser = mockUser();
        const mockPage = new Page();
        mockPage.authorId = mockReqUser._id;
        (pageService.findOne as jest.Mock).mockResolvedValueOnce(null);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );
        expect.assertions(4);

        try {
          await resolver.updatePage(updatePageInput, mockReqUser);
        } catch (error) {
          expect(pageService.findOne).toHaveBeenLastCalledWith({
            _id: updatePageInput._id,
          });
          expect(pageService.update).not.toHaveBeenCalled();
          expect(pageMutationResolver()).toEqual(Page);
          expect(caslService.hasAbilityOrThrow).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('deletePage', () => {
    it('should call service delete page passing page id if allowed by ability check', async () => {
      const mockPageId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockPage = new Page();
      mockPage.authorId = mockReqUser._id;
      (pageService.findOne as jest.Mock).mockResolvedValueOnce(mockPage);
      (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await resolver.deletePage(mockPageId, mockReqUser);

      expect(pageService.deleteOne).toHaveBeenLastCalledWith(mockPageId);
      expect(pageService.findOne).toHaveBeenLastCalledWith({ _id: mockPageId });
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockPage,
      );
    });
  });

  describe('findPagesByTitleOrSlug', () => {
    it('should call service passing query', async () => {
      (pageService.findManyByTitleOrSlug as jest.Mock).mockResolvedValueOnce(
        [],
      );
      const result = await resolver.findPagesByTitleOrSlug('hello');

      expect(pageService.findManyByTitleOrSlug).toHaveBeenLastCalledWith(
        'hello',
      );
      expect(result).toEqual([]);
      expect(pageTitleOrSlugQueryResultResolver()).toEqual([Page]);
    });
  });
});
