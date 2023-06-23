import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { BlocksQueryResultUnion } from './block.dto';
import { BlockType } from './block.interface';
import {
  blockKindQueryResolver,
  blockNameQueryResolver,
  blockNameQueryResultResolver,
  BlockResolver,
} from './block.resolver';
import { BlockService } from './block.service';

jest.mock('./block.service');

describe('BlockResolver', () => {
  let resolver: BlockResolver;
  let service: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockResolver, BlockService],
    }).compile();

    resolver = module.get<BlockResolver>(BlockResolver);
    service = module.get<BlockService>(BlockService);
    (service.throwBlockNotFound as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    (BlockService as jest.Mock).mockClear();
  });

  describe('blockKind', () => {
    describe('when block exits', () => {
      it('should return block kind', async () => {
        const mockId = new Types.ObjectId().toString();
        (service.findOneById as jest.Mock).mockResolvedValueOnce({
          kind: 'foo',
        });
        const result = await resolver.blockKind(mockId);

        expect(service.findOneById).toHaveBeenLastCalledWith(mockId);
        expect(result).toEqual('foo');
        expect(blockKindQueryResolver()).toEqual(BlockType);
      });
    });

    describe('when block does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(1);
        const mockId = new Types.ObjectId().toString();
        (service.findOneById as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.blockKind(mockId);
        } catch (error) {
          expect(service.throwBlockNotFound).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('blockName', () => {
    describe('when block exits', () => {
      it('should return block name', async () => {
        const mockId = new Types.ObjectId().toString();
        (service.findOneById as jest.Mock).mockResolvedValueOnce({
          name: 'foo',
        });
        const result = await resolver.blockName(mockId);

        expect(service.findOneById).toHaveBeenLastCalledWith(mockId);
        expect(result).toEqual('foo');
        expect(blockNameQueryResolver()).toEqual(String);
      });
    });

    describe('when block does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(1);
        const mockId = new Types.ObjectId().toString();
        (service.findOneById as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.blockName(mockId);
        } catch (error) {
          expect(service.throwBlockNotFound).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('findBlocksByName', () => {
    it('should call service passing query', async () => {
      (service.findManyByName as jest.Mock).mockResolvedValueOnce([]);
      const result = await resolver.findBlocksByName('hello');

      expect(service.findManyByName).toHaveBeenLastCalledWith('hello');
      expect(result).toEqual([]);
      expect(blockNameQueryResultResolver()).toEqual([BlocksQueryResultUnion]);
    });
  });
});
