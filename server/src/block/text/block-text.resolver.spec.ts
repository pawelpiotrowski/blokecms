import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  mockBlockTextCreateInput,
  mockBlockTextInput,
} from '../../../test/helpers/block-text.dto.helper';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import {
  blocksTextCountQueryResolver,
  blocksTextQueryResolver,
  blockTextHtmlIncludeWebComponentTagsQueryResultResolver,
  blockTextMutationResolver,
  blockTextQueryResolver,
  BlockTextResolver,
} from './block-text.resolver';
import { BlockText } from './block-text.schema';
import { BlockTextService } from './block-text.service';

jest.mock('../block.service');
jest.mock('./block-text.service');

describe('BlockTextResolver', () => {
  let resolver: BlockTextResolver;
  let service: BlockTextService;
  let blockService: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockTextResolver, BlockTextService, BlockService],
    }).compile();

    resolver = module.get<BlockTextResolver>(BlockTextResolver);
    service = module.get<BlockTextService>(BlockTextService);
    blockService = module.get<BlockService>(BlockService);
    (blockService.throwBlockNotFound as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    (BlockTextService as jest.Mock).mockClear();
    (BlockService as jest.Mock).mockClear();
  });

  describe('blocksText', () => {
    it('should call service findAll text blocks', async () => {
      await resolver.blocksText();
      expect(service.findAll).toBeCalled();
      expect(blocksTextQueryResolver()).toEqual([BlockText]);
    });
  });

  describe('blocksTextCount', () => {
    it('should call service count blocks', async () => {
      await resolver.blocksTextCount();
      expect(service.count).toBeCalled();
      expect(blocksTextCountQueryResolver()).toEqual(Number);
    });
  });

  describe('blockText', () => {
    describe('when block exits', () => {
      it('should return it', async () => {
        const mockInput = { name: 'bar', text: 'Lorem ipsum' };
        const mockResolvedBlock = mockBlockTextCreateInput();
        (service.findOne as jest.Mock).mockResolvedValueOnce(mockResolvedBlock);
        const result = await resolver.blockText(mockInput);

        expect(service.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedBlock);
        expect(blockTextQueryResolver()).toEqual(BlockText);
      });
    });

    describe('when block does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(1);
        const mockInput = { name: 'test', text: 'foo' };
        (service.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.blockText(mockInput);
        } catch (error) {
          expect(blockService.throwBlockNotFound).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('createBlockText', () => {
    it('should call service create text block passing input user id as authorId and block type', async () => {
      const blockInput = mockBlockTextInput();
      const user = mockUser();

      await resolver.createBlockText(blockInput, user);
      expect(service.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        kind: BlockType.Text,
        ...blockInput,
      });
      expect(blockTextMutationResolver()).toEqual(BlockText);
    });
  });

  describe('updateBlockText', () => {
    it('should call service update passing input', async () => {
      const updateBlockTextInput = {
        _id: new Types.ObjectId(),
        name: 'foo',
        text: '123',
      };
      const mockReqUser = mockUser();
      const mockBlock = new BlockText();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.updateBlockText(updateBlockTextInput, mockReqUser);
      expect(service.update).toHaveBeenLastCalledWith({
        ...updateBlockTextInput,
      });
      expect(blockTextMutationResolver()).toEqual(BlockText);
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Update,
        mockBlock,
        new BlockText(),
      );
    });
  });

  describe('deleteBlockText', () => {
    it('should call service delete block passing block id if allowed by ability check', async () => {
      const mockBlockId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockBlock = new BlockText();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.deleteBlockText(mockBlockId, mockReqUser);

      expect(service.deleteOne).toHaveBeenLastCalledWith(mockBlockId);
      expect(service.findOne).toHaveBeenLastCalledWith({
        _id: mockBlockId,
      });
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockBlock,
        new BlockText(),
      );
    });
  });

  describe('htmlIncludeWebComponentTags', () => {
    it('should call service include web components method to get html with web component tags', () => {
      (service.includeWebComponentTags as jest.Mock).mockReturnValueOnce('foo');
      const mockBlock = {
        name: 'bar',
        html: 'hello',
        _id: '123',
      };

      expect(resolver.htmlIncludeWebComponentTags(mockBlock as any)).toEqual(
        'foo',
      );
      expect(service.includeWebComponentTags).toHaveBeenLastCalledWith(
        mockBlock,
      );
      expect(blockTextHtmlIncludeWebComponentTagsQueryResultResolver()).toEqual(
        String,
      );
    });
  });
});
