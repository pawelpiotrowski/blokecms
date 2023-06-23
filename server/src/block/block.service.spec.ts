import { NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockBlockCodeCreateInput } from '../../test/helpers/block-code.dto.helper';
import { mockBlockMediaCreateInput } from '../../test/helpers/block-media.dto.helper';
import { mockBlockTextCreateInput } from '../../test/helpers/block-text.dto.helper';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/helpers/mongoose.helper';
import { mockUser } from '../../test/helpers/user.dto.helper';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import { BlockType } from './block.interface';
import { BlockService } from './block.service';
import { BlockCodeLang } from './code/block-code.interface';
import { BlockCode, BlockCodeSchema } from './code/block-code.schema';
import { BlockCodeService } from './code/block-code.service';
import { BlockMedia, BlockMediaSchema } from './media/block-media.schema';
import { BlockMediaService } from './media/block-media.service';
import { BlockText, BlockTextSchema } from './text/block-text.schema';
import { BlockTextService } from './text/block-text.service';

jest.mock('../casl/casl.service');

describe('BlockService', () => {
  let blockService: BlockService;
  let blockTextService: BlockTextService;
  let blockMediaService: BlockMediaService;
  let blockCodeService: BlockCodeService;
  let caslService: CaslService;
  let module: TestingModule;
  const createBlockTextInput1 = mockBlockTextCreateInput();
  const createBlockTextInput2 = mockBlockTextCreateInput();
  const createBlockMediaInput1 = mockBlockMediaCreateInput();
  const createBlockMediaInput2 = mockBlockMediaCreateInput();
  const createBlockCodeInput1 = mockBlockCodeCreateInput(
    '<b>B</b>',
    BlockCodeLang.markup,
  );
  const createBlockCodeInput2 = mockBlockCodeCreateInput(
    'body { display: block; }',
    BlockCodeLang.css,
  );
  let blockText1;
  let blockText2;
  let blockMedia1;
  let blockMedia2;
  let blockCode1;
  let blockCode2;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: BlockText.name, schema: BlockTextSchema },
          { name: BlockMedia.name, schema: BlockMediaSchema },
          { name: BlockCode.name, schema: BlockCodeSchema },
        ]),
      ],
      providers: [
        BlockService,
        BlockTextService,
        BlockMediaService,
        BlockCodeService,
        CaslService,
      ],
    }).compile();

    blockService = module.get<BlockService>(BlockService);
    blockTextService = module.get<BlockTextService>(BlockTextService);
    blockMediaService = module.get<BlockMediaService>(BlockMediaService);
    blockCodeService = module.get<BlockCodeService>(BlockCodeService);
    caslService = module.get<CaslService>(CaslService);

    blockText1 = await blockTextService.create(createBlockTextInput1);
    blockText2 = await blockTextService.create(createBlockTextInput2);
    blockMedia1 = await blockMediaService.create(createBlockMediaInput1);
    blockMedia2 = await blockMediaService.create(createBlockMediaInput2);
    blockCode1 = await blockCodeService.create(createBlockCodeInput1);
    blockCode2 = await blockCodeService.create(createBlockCodeInput2);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('findOneById', () => {
    it('should find block by id searching in all block collections', async () => {
      const resultBlockText1 = (await blockService.findOneById(
        blockText1._id,
      )) as BlockText;
      const resultBlockText2 = (await blockService.findOneById(
        blockText2._id,
      )) as BlockText;
      const resultBlockMedia1 = (await blockService.findOneById(
        blockMedia1._id,
      )) as BlockMedia;
      const resultBlockMedia2 = (await blockService.findOneById(
        blockMedia2._id,
      )) as BlockMedia;
      const resultBlockCode1 = (await blockService.findOneById(
        blockCode1._id,
      )) as BlockCode;
      const resultBlockCode2 = (await blockService.findOneById(
        blockCode2._id,
      )) as BlockCode;
      const notFound = await blockService.findOneById(new Types.ObjectId());

      expect(resultBlockText1._id.toString()).toEqual(
        blockText1._id.toString(),
      );
      expect(resultBlockText1.kind).toEqual(BlockType.Text);
      expect(resultBlockText2.text).toEqual(blockText2.text);

      expect(resultBlockMedia1._id.toString()).toEqual(
        blockMedia1._id.toString(),
      );
      expect(resultBlockMedia1.kind).toEqual(BlockType.Media);
      expect(resultBlockMedia2.url).toEqual(blockMedia2.url);

      expect(resultBlockCode1._id.toString()).toEqual(
        blockCode1._id.toString(),
      );
      expect(resultBlockCode1.kind).toEqual(BlockType.Code);
      expect(resultBlockCode2.code).toEqual('body { display: block; }');

      expect(notFound).toEqual(null);
    });
  });

  describe('findManyByName', () => {
    let blockSearchText1;
    let blockSearchText2;
    let blockSearchMedia1;
    let blockSearchMedia2;
    let blockSearchCode1;
    let blockSearchCode2;
    const blockSearchText1Input = mockBlockTextCreateInput();
    blockSearchText1Input.name = 'Captain America';
    const blockSearchText2Input = mockBlockTextCreateInput();
    blockSearchText2Input.name = 'Shaun the sheep';
    const blockSearchMedia1Input = mockBlockMediaCreateInput();
    blockSearchMedia1Input.name = 'Screenshot 1';
    const blockSearchMedia2Input = mockBlockMediaCreateInput();
    blockSearchMedia2Input.name = 'Screenshot 1';

    const blockSearchCode1Input = mockBlockCodeCreateInput(
      '',
      BlockCodeLang.css,
    );
    blockSearchCode1Input.name = 'CSS code';
    const blockSearchCode2Input = mockBlockCodeCreateInput(
      '',
      BlockCodeLang.markup,
    );
    blockSearchCode2Input.name = 'HTML code';

    beforeAll(async () => {
      blockSearchText1 = await blockTextService.create(blockSearchText1Input);
      blockSearchText2 = await blockTextService.create(blockSearchText2Input);
      blockSearchMedia1 = await blockMediaService.create(
        blockSearchMedia1Input,
      );
      blockSearchMedia2 = await blockMediaService.create(
        blockSearchMedia2Input,
      );
      blockSearchCode1 = await blockCodeService.create(blockSearchCode1Input);
      blockSearchCode2 = await blockCodeService.create(blockSearchCode2Input);
    });

    describe('with nothing found or empty query', () => {
      it('should return empty array', async () => {
        const result1 = await blockService.findManyByName('123456789987654321');

        expect(result1).toEqual([]);

        const result2 = await blockService.findManyByName('');

        expect(result2).toEqual([]);
      });
    });

    describe('with single character query', () => {
      it('should return array of blocks with name that starts with character', async () => {
        const result = await blockService.findManyByName('s');
        const resultNames = result.map((item) => item.name);

        expect(resultNames).not.toContain(blockSearchText1.name);
        expect(resultNames).toContain(blockSearchText2.name);
        expect(resultNames).toContain(blockSearchMedia1.name);
        expect(resultNames).toContain(blockSearchMedia2.name);
        expect(resultNames).not.toContain(blockSearchCode1.name);
        expect(resultNames).not.toContain(blockSearchCode1.name);
      });
    });

    describe('with more than 1 characters query', () => {
      it('should return array of blocks with name that contains characters', async () => {
        const result = await blockService.findManyByName('ee');
        const resultNames = result.map((item) => item.name);

        expect(resultNames).not.toContain(blockSearchText1.name);
        expect(resultNames).toContain(blockSearchText2.name);
        expect(resultNames).toContain(blockSearchMedia1.name);
        expect(resultNames).toContain(blockSearchMedia2.name);
        expect(resultNames).not.toContain(blockSearchCode1.name);
        expect(resultNames).not.toContain(blockSearchCode1.name);

        const moreResults = await blockService.findManyByName('code');
        const moreResultsNames = moreResults.map((item) => item.name);
        expect(moreResultsNames).toContain(blockSearchCode1.name);
        expect(moreResultsNames).toContain(blockSearchCode1.name);
        expect(moreResultsNames).not.toContain(blockSearchText1.name);
        expect(moreResultsNames).not.toContain(blockSearchText2.name);
        expect(moreResultsNames).not.toContain(blockSearchMedia1.name);
        expect(moreResultsNames).not.toContain(blockSearchMedia2.name);
      });
    });
  });

  describe('throwBlockNotFound', () => {
    it('should throw block not found exception', () => {
      expect(() => blockService.throwBlockNotFound()).toThrowError(
        new NotFoundException('Block not found'),
      );
    });
  });

  describe('checkAbility', () => {
    it('should throw not found exception if block is nullish', async () => {
      expect.assertions(1);

      try {
        await blockService.checkAbility(
          mockUser(),
          CaslAction.Manage,
          null,
          null,
        );
      } catch (error) {
        expect(error).toEqual(new NotFoundException('Block not found'));
      }
    });

    it('should check casl ability for given block and user if block i not nullish', async () => {
      const mockReqUser = mockUser();
      const mockAction = CaslAction.Update;
      const mockBlock = new BlockText();
      mockBlock.authorId = mockReqUser._id;
      const mockBlockCheck = new BlockText();

      await blockService.checkAbility(
        mockReqUser,
        mockAction,
        mockBlock,
        mockBlockCheck,
      );

      expect(
        caslService.hasAbilityOrThrow as jest.Mock,
      ).toHaveBeenLastCalledWith(mockReqUser, mockAction, mockBlockCheck);
    });
  });
});
