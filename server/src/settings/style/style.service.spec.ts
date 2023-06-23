import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { Style, StyleSchema } from './style.schema';
import { StyleService } from './style.service';

describe('StyleService', () => {
  let service: StyleService;
  let module: TestingModule;
  const mockAuthorId = new Types.ObjectId().toString();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Style.name,
            schema: StyleSchema,
          },
        ]),
      ],
      providers: [StyleService],
    }).compile();

    service = module.get<StyleService>(StyleService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create style with StyleCreateInput and minify formatted code', async () => {
      const mockStyleInput = {
        name: 'test',
        formatted:
          'body { margin: 0; padding: 0; }\n div { font-weight: bold; }',
        authorId: mockAuthorId,
      };
      const createdStyle = await service.create(mockStyleInput);

      expect(createdStyle._id).toBeDefined();
      expect(createdStyle.name).toEqual(mockStyleInput.name);
      expect(createdStyle.formatted).toEqual(mockStyleInput.formatted);
      expect(createdStyle.minified).toEqual(
        'body{margin:0;padding:0}div{font-weight:700}',
      );
    });
  });

  describe('update', () => {
    it('should update style', async () => {
      const createdStyle = await service.create({
        name: 'main',
        formatted: 'html { margin: 0; padding: 0; }',
        authorId: mockAuthorId,
      });
      const mockUpdate = {
        _id: createdStyle._id,
        name: 'main-edited',
      };
      await service.update(mockUpdate);

      const findUpdatedStyle = await service.findOne({
        _id: createdStyle._id,
      });
      expect(findUpdatedStyle.name).toEqual(mockUpdate.name);
    });
  });

  describe('findAll', () => {
    it('should get a list of styles', async () => {
      const styles = await service.findAll();

      expect(styles).toBeDefined();
      expect(Array.isArray(styles)).toBe(true);
      expect(styles.length).toBe(2);
      expect(styles[0].name).toBe('test');
    });
  });

  describe('findOne', () => {
    it('should return style if exists otherwise null', async () => {
      const createStyle1Input = {
        name: 'Style 1',
        formatted: 'html { margin: 0; padding: 0; }',
        authorId: mockAuthorId,
      };
      const createStyle2Input = {
        name: 'Style 2',
        formatted: 'html { margin: 0; padding: 0; }',
        authorId: mockAuthorId,
      };
      const createdStyle1 = await service.create(createStyle1Input);
      const createdStyle2 = await service.create(createStyle2Input);

      const style1FindOneById = await service.findOne({
        _id: createdStyle1._id,
      });
      const style1FindOneByName = await service.findOne({
        name: createdStyle1.name,
      });
      const style2FindOneById = await service.findOne({
        _id: createdStyle2._id,
      });
      const style2FindOneByName = await service.findOne({
        name: createdStyle2.name,
      });
      const styleNotFound = await service.findOne({
        name: 'not-here',
      });

      expect(style1FindOneById.name).toEqual(createdStyle1.name);
      expect(style1FindOneByName._id.toString()).toEqual(
        createdStyle1._id.toString(),
      );
      expect(style2FindOneById.name).toEqual(createdStyle2.name);
      expect(style2FindOneByName._id.toString()).toEqual(
        createdStyle2._id.toString(),
      );
      expect(styleNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete style by id', async () => {
      const createdStyle = await service.create({
        name: 'deleteme',
        formatted: 'body { opacity: 1; }',
        authorId: mockAuthorId,
      });

      const styleFindOneById = await service.findOne({
        _id: createdStyle._id,
      });
      expect(styleFindOneById._id).toBeDefined();

      await service.deleteOne(styleFindOneById._id);

      const styleFindOneByIdAfterDelete = await service.findOne({
        _id: createdStyle._id,
      });
      expect(styleFindOneByIdAfterDelete).toEqual(null);
    });
  });
});
