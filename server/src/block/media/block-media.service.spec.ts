import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { promises } from 'fs';
import { join } from 'path';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { BlockMediaService } from './block-media.service';
import { BlockMedia, BlockMediaSchema } from './block-media.schema';
import { mockBlockMediaCreateInput } from '../../../test/helpers/block-media.dto.helper';
import { BlockType } from '../block.interface';
import { uploadFileInterceptorForDiskStorage } from '../../upload/upload.constants';

describe('BlockMediaService', () => {
  let service: BlockMediaService;
  let module: TestingModule;
  const createBlockMediaInput = mockBlockMediaCreateInput();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: BlockMedia.name, schema: BlockMediaSchema },
        ]),
      ],
      providers: [BlockMediaService],
    }).compile();

    service = module.get<BlockMediaService>(BlockMediaService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create a media block with BlockMediaCreateInput', async () => {
      const createdBlock = await service.create(createBlockMediaInput);

      expect(createdBlock._id).toBeDefined();
      expect(createdBlock.name).toEqual(createBlockMediaInput.name);
      expect(createdBlock.url).toEqual(createBlockMediaInput.url);
      expect(createdBlock.authorId.toString()).toEqual(
        createBlockMediaInput.authorId,
      );
      expect(createdBlock.kind).toEqual(BlockType.Media);
    });
  });

  describe('findAll', () => {
    it('should get a list of media blocks', async () => {
      const blocks = await service.findAll();

      expect(blocks).toBeDefined();
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(1);
      expect(blocks[0].url).toBe(createBlockMediaInput.url);
    });
  });

  describe('count', () => {
    it('should get a count of media blocks', async () => {
      const blocks = await service.count();

      expect(blocks).toBeDefined();
      expect(blocks).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne', () => {
    it('should return media block if exists otherwise null', async () => {
      const createBlock1Input = mockBlockMediaCreateInput();
      const createBlock2Input = mockBlockMediaCreateInput();
      const createBlock1 = await service.create(createBlock1Input);
      const createBlock2 = await service.create(createBlock2Input);

      const block1FindOneById = await service.findOne({
        _id: createBlock1._id,
      });
      const block1FindOneByAuthorId = await service.findOne({
        authorId: createBlock1.authorId,
      });
      const block1FindOneByUrl = await service.findOne({
        url: createBlock1.url,
      });
      const block2FindOneById = await service.findOne({
        _id: createBlock2._id,
      });
      const block2FindOneByAuthorId = await service.findOne({
        authorId: createBlock2.authorId,
      });
      const blockNotFound = await service.findOne({
        name: 'test',
      });

      expect(block1FindOneById._id.toString()).toEqual(
        createBlock1._id.toString(),
      );
      expect(block1FindOneByAuthorId.authorId.toString()).toEqual(
        createBlock1.authorId.toString(),
      );
      expect(block1FindOneByUrl.url).toEqual(createBlock1.url);
      expect(block2FindOneById._id.toString()).toEqual(
        createBlock2._id.toString(),
      );
      expect(block2FindOneByAuthorId.authorId.toString()).toEqual(
        createBlock2.authorId.toString(),
      );
      expect(blockNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete media block by id', async () => {
      const fsUnlinkSpy = jest.spyOn(promises, 'unlink').mockResolvedValue();
      const createdBlock = await service.create(mockBlockMediaCreateInput());
      const blockFindOneById = await service.findOne({
        _id: createdBlock._id,
      });
      expect(blockFindOneById._id).toBeDefined();

      await service.deleteOne(blockFindOneById._id);

      const blockFindOneByIdAfterDelete = await service.findOne({
        _id: createdBlock._id,
      });
      expect(blockFindOneByIdAfterDelete).toEqual(null);

      expect(fsUnlinkSpy).toHaveBeenLastCalledWith(
        expect.stringContaining(
          join(
            uploadFileInterceptorForDiskStorage.destination as string,
            blockFindOneById.url,
          ),
        ),
      );

      fsUnlinkSpy.mockClear();
      // if deleted block is null
      await service.deleteOne(blockFindOneById._id);
      expect(fsUnlinkSpy).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update media block', async () => {
      const createdBlock = await service.create(mockBlockMediaCreateInput());
      const mockUpdate = {
        _id: createdBlock._id,
        name: 'The Name',
        url: 'http://lorem-ipsum.com',
      };
      const updatedBlock = await service.update(mockUpdate);
      const findUpdatedBlock = await service.findOne({
        _id: createdBlock._id,
      });
      expect(updatedBlock.name).toEqual(findUpdatedBlock.name);
      expect(findUpdatedBlock.url).toEqual(mockUpdate.url);
    });
  });

  describe('findManyByName', () => {
    it('should return media block with name matching query', async () => {
      const result = await service.findManyByName(new RegExp('^The N', 'i'));

      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual('The Name');
    });
  });
});
