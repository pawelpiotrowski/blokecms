import { Test, TestingModule } from '@nestjs/testing';
import { BlockCodeService } from './block-code.service';
import { mockBlockCodeCreateInput } from '../../../test/helpers/block-code.dto.helper';
import { BlockCodeLang } from './block-code.interface';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockCode, BlockCodeSchema } from './block-code.schema';
import { BlockType } from '../block.interface';

describe('BlockCodeService', () => {
  let service: BlockCodeService;
  let module: TestingModule;

  const createBlockCodeInputCode = 'html { display: none }';
  const createBlockCodeInputLang = BlockCodeLang.css;
  const createBlockCodeInput = mockBlockCodeCreateInput(
    createBlockCodeInputCode,
    createBlockCodeInputLang,
  );

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: BlockCode.name, schema: BlockCodeSchema },
        ]),
      ],
      providers: [BlockCodeService],
    }).compile();

    service = module.get<BlockCodeService>(BlockCodeService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create a code block with BlockCodeCreateInput', async () => {
      const createdBlock = await service.create(createBlockCodeInput);

      expect(createdBlock._id).toBeDefined();
      expect(createdBlock.name).toEqual(createBlockCodeInput.name);
      expect(createdBlock.code).toEqual(createBlockCodeInputCode);
      expect(createdBlock.lang).toEqual(createBlockCodeInputLang);
      expect(createdBlock.authorId.toString()).toEqual(
        createBlockCodeInput.authorId,
      );
      expect(createdBlock.kind).toEqual(BlockType.Code);
    });
  });

  describe('findAll', () => {
    it('should get a list of code blocks', async () => {
      const blocks = await service.findAll();

      expect(blocks).toBeDefined();
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(1);
      expect(blocks[0].code).toBe(createBlockCodeInputCode);
    });
  });

  describe('count', () => {
    it('should get a count of code blocks', async () => {
      const blocks = await service.count();

      expect(blocks).toBeDefined();
      expect(blocks).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne', () => {
    it('should return code block if exists otherwise null', async () => {
      const createBlock1Input = mockBlockCodeCreateInput(
        'const a = "foo";',
        BlockCodeLang.javascript,
      );
      const createBlock2Input = mockBlockCodeCreateInput(
        '<i>a</i>',
        BlockCodeLang.markup,
      );
      const createBlock1 = await service.create(createBlock1Input);
      const createBlock2 = await service.create(createBlock2Input);

      const block1FindOneById = await service.findOne({
        _id: createBlock1._id,
      });
      const block1FindOneByAuthorId = await service.findOne({
        authorId: createBlock1.authorId,
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
    it('should delete code block by id', async () => {
      const createdBlock = await service.create(
        mockBlockCodeCreateInput('let i = 1;', BlockCodeLang.typescript),
      );
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
    it('should update code block', async () => {
      const createdBlockCode = 'i { color: red; }';
      const createdBlock = await service.create(
        mockBlockCodeCreateInput(createdBlockCode, BlockCodeLang.css),
      );
      const mockUpdateCode = '<i>T</i>';
      const mockUpdate = {
        _id: createdBlock._id,
        name: 'The Name',
        code: mockUpdateCode,
        lang: BlockCodeLang.markup,
      };
      const updatedBlock = await service.update(mockUpdate);
      const findUpdatedBlock = await service.findOne({
        _id: createdBlock._id,
      });
      expect(updatedBlock.name).toEqual(findUpdatedBlock.name);
      expect(findUpdatedBlock.code).not.toEqual(createdBlockCode);
      expect(findUpdatedBlock.code).toEqual(mockUpdateCode);
    });
  });

  describe('findManyByName', () => {
    it('should return code block with name matching query', async () => {
      const result = await service.findManyByName(new RegExp('^The N', 'i'));

      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual('The Name');
    });
  });
});
