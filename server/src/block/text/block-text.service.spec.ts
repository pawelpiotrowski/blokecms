import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { BlockTextService } from './block-text.service';
import { BlockType } from '../block.interface';
import { mockBlockTextCreateInput } from '../../../test/helpers/block-text.dto.helper';
import { BlockText, BlockTextSchema } from './block-text.schema';

describe('BlockTextService', () => {
  let service: BlockTextService;
  let module: TestingModule;
  const createBlockTextInput = mockBlockTextCreateInput();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: BlockText.name, schema: BlockTextSchema },
        ]),
      ],
      providers: [BlockTextService],
    }).compile();

    service = module.get<BlockTextService>(BlockTextService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create a text block with BlockTextCreateInput', async () => {
      const createdBlock = await service.create(createBlockTextInput);

      expect(createdBlock._id).toBeDefined();
      expect(createdBlock.name).toEqual(createBlockTextInput.name);
      expect(createdBlock.text).toEqual(createBlockTextInput.text);
      expect(createdBlock.authorId.toString()).toEqual(
        createBlockTextInput.authorId,
      );
      expect(createdBlock.kind).toEqual(BlockType.Text);
    });
  });

  describe('findAll', () => {
    it('should get a list of text blocks', async () => {
      const blocks = await service.findAll();

      expect(blocks).toBeDefined();
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(1);
      expect(blocks[0].text).toBe(createBlockTextInput.text);
    });
  });

  describe('count', () => {
    it('should get a count of blocks', async () => {
      const blocks = await service.count();

      expect(blocks).toBeDefined();
      expect(blocks).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne', () => {
    it('should return text block if exists otherwise null', async () => {
      const createBlock1Input = mockBlockTextCreateInput();
      const createBlock2Input = mockBlockTextCreateInput();
      const createBlock1 = await service.create(createBlock1Input);
      const createBlock2 = await service.create(createBlock2Input);

      const block1FindOneById = await service.findOne({
        _id: createBlock1._id,
      });
      const block1FindOneByAuthorId = await service.findOne({
        authorId: createBlock1.authorId,
      });
      const block1FindOneByText = await service.findOne({
        text: createBlock1.text,
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
      expect(block1FindOneByText.text).toEqual(createBlock1.text);
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
    it('should delete text block by id', async () => {
      const createdBlock = await service.create(mockBlockTextCreateInput());
      const blockFindOneById = await service.findOne({
        _id: createdBlock._id,
      });
      expect(blockFindOneById._id).toBeDefined();

      await service.deleteOne(blockFindOneById._id);

      const blockFindOneByIdAfterDelete = await service.findOne({
        _id: createdBlock._id,
      });
      expect(blockFindOneByIdAfterDelete).toEqual(null);
    });
  });

  describe('update', () => {
    it('should update block text', async () => {
      const createdBlock = await service.create(mockBlockTextCreateInput());
      const mockUpdate = {
        _id: createdBlock._id,
        name: 'The Name',
        text: 'Lorem Ipsum',
      };
      const updatedBlock = await service.update(mockUpdate);
      const findUpdatedBlock = await service.findOne({
        _id: createdBlock._id,
      });
      expect(updatedBlock.name).toEqual(findUpdatedBlock.name);
      expect(findUpdatedBlock.text).toEqual(mockUpdate.text);
    });
  });

  describe('findManyByName', () => {
    it('should return block text with name matching query', async () => {
      const result = await service.findManyByName(new RegExp('^The N', 'i'));

      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual('The Name');
    });
  });

  describe('includeWebComponentTags', () => {
    it('should return unchanged block html if it does not contain web component selector', async () => {
      const block = await service.create(mockBlockTextCreateInput());

      expect(service.includeWebComponentTags(block)).toEqual(block.html);
    });

    it('should return block html with web component tags if it contain web component selector', async () => {
      const block = await service.create(mockBlockTextCreateInput());
      block.html =
        '<p>-%NestcmsWebComponent%-</p><p>Inner stuff</p><p>-%/NestcmsWebComponent%-</p><br><p>-%NestcmsWebComponent%- Stuff inline -%/NestcmsWebComponent%-</p><p>Some stuff</p>';

      expect(service.includeWebComponentTags(block)).toEqual(
        '<nestcms-web-component><p>Inner stuff</p></nestcms-web-component><br><p><nestcms-web-component> Stuff inline </nestcms-web-component></p><p>Some stuff</p>',
      );
    });
  });
});
