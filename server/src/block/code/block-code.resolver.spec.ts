import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  mockBlockCodeCreateInput,
  mockBlockCodeInput,
} from '../../../test/helpers/block-code.dto.helper';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import { BlockCodeLang } from './block-code.interface';
import {
  blockCodeMutationResolver,
  blockCodeQueryResolver,
  BlockCodeResolver,
  blocksCodeCountQueryResolver,
  blocksCodeQueryResolver,
} from './block-code.resolver';
import { BlockCode } from './block-code.schema';
import { BlockCodeService } from './block-code.service';

jest.mock('../block.service');
jest.mock('./block-code.service');

describe('BlockCodeResolver', () => {
  let resolver: BlockCodeResolver;
  let service: BlockCodeService;
  let blockService: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockCodeResolver, BlockCodeService, BlockService],
    }).compile();

    resolver = module.get<BlockCodeResolver>(BlockCodeResolver);
    service = module.get<BlockCodeService>(BlockCodeService);
    blockService = module.get<BlockService>(BlockService);
    (blockService.throwBlockNotFound as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    (BlockCodeService as jest.Mock).mockClear();
    (BlockService as jest.Mock).mockClear();
  });

  describe('blocksCode', () => {
    it('should call service findAll code blocks', async () => {
      await resolver.blocksCode();
      expect(service.findAll).toBeCalled();
      expect(blocksCodeQueryResolver()).toEqual([BlockCode]);
    });
  });

  describe('blocksCodeCount', () => {
    it('should call service count blocks', async () => {
      await resolver.blocksCodeCount();
      expect(service.count).toBeCalled();
      expect(blocksCodeCountQueryResolver()).toEqual(Number);
    });
  });

  describe('blockCode', () => {
    describe('when block exits', () => {
      it('should return it', async () => {
        const mockInput = {
          name: 'bar',
          code: 'let i;',
          lang: BlockCodeLang.javascript,
        };
        const mockResolvedBlock = mockBlockCodeCreateInput(
          mockInput.code,
          mockInput.lang,
        );
        (service.findOne as jest.Mock).mockResolvedValueOnce(mockResolvedBlock);
        const result = await resolver.blockCode(mockInput);

        expect(service.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedBlock);
        expect(blockCodeQueryResolver()).toEqual(BlockCode);
      });
    });

    describe('when block does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(1);
        const mockInput = {
          name: 'foo',
          code: 'let a;',
          lang: BlockCodeLang.javascript,
        };
        (service.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.blockCode(mockInput);
        } catch (error) {
          expect(blockService.throwBlockNotFound).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('createBlockCode', () => {
    it('should call service create code block passing input user id as authorId and block type', async () => {
      const blockInput = mockBlockCodeInput('let i;', BlockCodeLang.javascript);
      const user = mockUser();

      await resolver.createBlockCode(blockInput, user);
      expect(service.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        kind: BlockType.Code,
        ...blockInput,
      });
      expect(blockCodeMutationResolver()).toEqual(BlockCode);
    });
  });

  describe('updateBlockCode', () => {
    it('should call service update passing input', async () => {
      const updateBlockCodeInput = {
        _id: new Types.ObjectId(),
        name: 'foo',
      };
      const mockReqUser = mockUser();
      const mockBlock = new BlockCode();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.updateBlockCode(updateBlockCodeInput, mockReqUser);
      expect(service.update).toHaveBeenLastCalledWith({
        ...updateBlockCodeInput,
      });
      expect(blockCodeMutationResolver()).toEqual(BlockCode);
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Update,
        mockBlock,
        new BlockCode(),
      );
    });
  });

  describe('deleteBlockCode', () => {
    it('should call service delete block passing block id if allowed by ability check', async () => {
      const mockBlockId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockBlock = new BlockCode();
      mockBlock.authorId = mockReqUser._id;
      (service.findOne as jest.Mock).mockResolvedValueOnce(mockBlock);

      await resolver.deleteBlockCode(mockBlockId, mockReqUser);

      expect(service.deleteOne).toHaveBeenLastCalledWith(mockBlockId);
      expect(service.findOne).toHaveBeenLastCalledWith({
        _id: mockBlockId,
      });
      expect(blockService.checkAbility).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockBlock,
        new BlockCode(),
      );
    });
  });
});
