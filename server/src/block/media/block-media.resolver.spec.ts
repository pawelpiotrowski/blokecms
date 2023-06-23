import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  mockBlockMediaCreateInput,
  mockBlockMediaInput,
} from '../../../test/helpers/block-media.dto.helper';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import {
  blockMediaMutationResolver,
  blockMediaQueryResolver,
  BlockMediaResolver,
  blocksMediaCountQueryResolver,
  blocksMediaQueryResolver,
} from './block-media.resolver';
import { BlockMedia } from './block-media.schema';
import { BlockMediaService } from './block-media.service';

jest.mock('../block.service');
jest.mock('./block-media.service');

describe('BlockMediaResolver', () => {
  let resolver: BlockMediaResolver;
  let service: BlockMediaService;
  let blockService: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockMediaResolver, BlockMediaService, BlockService],
    }).compile();

    resolver = module.get<BlockMediaResolver>(BlockMediaResolver);
    service = module.get<BlockMediaService>(BlockMediaService);
    blockService = module.get<BlockService>(BlockService);
    (blockService.throwBlockNotFound as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    (BlockMediaService as jest.Mock).mockClear();
    (BlockService as jest.Mock).mockClear();
  });

  describe('blocksMedia', () => {
    it('should call service findAll media blocks', async () => {
      await resolver.blocksMedia();
      expect(service.findAll).toBeCalled();
      expect(blocksMediaQueryResolver()).toEqual([BlockMedia]);
    });
  });

  describe('blocksMediaCount', () => {
    it('should call service count blocks', async () => {
      await resolver.blocksMediaCount();
      expect(service.count).toBeCalled();
      expect(blocksMediaCountQueryResolver()).toEqual(Number);
    });
  });

  describe('blockMedia', () => {
    describe('when block exits', () => {
      it('should return it', async () => {
        const mockInput = { name: 'bar', url: 'lorem-ipsum' };
        const mockResolvedBlock = mockBlockMediaCreateInput();
        (service.findOne as jest.Mock).mockResolvedValueOnce(mockResolvedBlock);
        const result = await resolver.blockMedia(mockInput);

        expect(service.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedBlock);
        expect(blockMediaQueryResolver()).toEqual(BlockMedia);
      });
    });

    describe('when block does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(1);
        const mockInput = { name: 'test', url: 'foo' };
        (service.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.blockMedia(mockInput);
        } catch (error) {
          expect(blockService.throwBlockNotFound).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('createBlockMedia', () => {
    it('should call service create media block passing input user id as authorId and block type', async () => {
      const blockInput = mockBlockMediaInput();
      const user = mockUser();

      await resolver.createBlockMedia(blockInput, user);
      expect(service.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        kind: BlockType.Media,
        ...blockInput,
      });
      expect(blockMediaMutationResolver()).toEqual(BlockMedia);
    });
  });

  describe('updateBlockMedia', () => {
    it('should call service update passing input', async () => {
      const updateBlockMediaInput = {
        _id: new Types.ObjectId(),
        name: 'foo',
        url: '123',
      };
      const mockReqUser = mockUser();
      const mockBlock = new BlockMedia();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.updateBlockMedia(updateBlockMediaInput, mockReqUser);
      expect(service.update).toHaveBeenLastCalledWith({
        ...updateBlockMediaInput,
      });
      expect(blockMediaMutationResolver()).toEqual(BlockMedia);
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Update,
        mockBlock,
        new BlockMedia(),
      );
    });
  });

  describe('deleteBlockMedia', () => {
    it('should call service delete block passing block id if allowed by ability check', async () => {
      const mockBlockId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockBlock = new BlockMedia();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.deleteBlockMedia(mockBlockId, mockReqUser);

      expect(service.deleteOne).toHaveBeenLastCalledWith(mockBlockId);
      expect(service.findOne).toHaveBeenLastCalledWith({
        _id: mockBlockId,
      });
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockBlock,
        new BlockMedia(),
      );
    });
  });
});
