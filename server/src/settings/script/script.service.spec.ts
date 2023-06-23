import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/helpers/mongoose.helper';
import { Script, ScriptSchema } from './script.schema';
import { ScriptService } from './script.service';

describe('ScriptService', () => {
  let service: ScriptService;
  let module: TestingModule;
  const mockAuthorId = new Types.ObjectId().toString();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Script.name,
            schema: ScriptSchema,
          },
        ]),
      ],
      providers: [ScriptService],
    }).compile();

    service = module.get<ScriptService>(ScriptService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  describe('create', () => {
    it('should create script with ScriptCreateInput and minify formatted code', async () => {
      const mockScriptInput = {
        name: 'test',
        formatted: 'const hello = "world";',
        authorId: mockAuthorId,
      };
      const createdScript = await service.create(mockScriptInput);

      expect(createdScript._id).toBeDefined();
      expect(createdScript.name).toEqual(mockScriptInput.name);
      expect(createdScript.formatted).toEqual(mockScriptInput.formatted);
      expect(createdScript.minified).toEqual('const hello="world";');
    });
  });

  describe('update', () => {
    it('should update script', async () => {
      const createdScript = await service.create({
        name: 'main',
        formatted: 'window.alert("Foo Bar")',
        authorId: mockAuthorId,
      });
      const mockUpdate = {
        _id: createdScript._id,
        name: 'main-edited',
      };
      await service.update(mockUpdate);

      const findUpdatedScript = await service.findOne({
        _id: createdScript._id,
      });
      expect(findUpdatedScript.name).toEqual(mockUpdate.name);
    });
  });

  describe('findAll', () => {
    it('should get a list of scripts', async () => {
      const scripts = await service.findAll();

      expect(scripts).toBeDefined();
      expect(Array.isArray(scripts)).toBe(true);
      expect(scripts.length).toBe(2);
      expect(scripts[0].name).toBe('test');
    });
  });

  describe('findOne', () => {
    it('should return script if exists otherwise null', async () => {
      const createScript1Input = {
        name: 'Script 1',
        formatted: 'function hello() { console.log("world"); }',
        authorId: mockAuthorId,
      };
      const createScript2Input = {
        name: 'Script 2',
        formatted: 'function hello() { console.log("world"); }',
        authorId: mockAuthorId,
      };
      const createdScript1 = await service.create(createScript1Input);
      const createdScript2 = await service.create(createScript2Input);

      const script1FindOneById = await service.findOne({
        _id: createdScript1._id,
      });
      const script1FindOneByName = await service.findOne({
        name: createdScript1.name,
      });
      const script2FindOneById = await service.findOne({
        _id: createdScript2._id,
      });
      const script2FindOneByName = await service.findOne({
        name: createdScript2.name,
      });
      const scriptNotFound = await service.findOne({
        name: 'not-here',
      });

      expect(script1FindOneById.name).toEqual(createdScript1.name);
      expect(script1FindOneByName._id.toString()).toEqual(
        createdScript1._id.toString(),
      );
      expect(script2FindOneById.name).toEqual(createdScript2.name);
      expect(script2FindOneByName._id.toString()).toEqual(
        createdScript2._id.toString(),
      );
      expect(scriptNotFound).toEqual(null);
    });
  });

  describe('deleteOne', () => {
    it('should delete script by id', async () => {
      const createdScript = await service.create({
        name: 'deleteme',
        formatted: 'const body = { opacity: 1 };',
        authorId: mockAuthorId,
      });

      const scriptFindOneById = await service.findOne({
        _id: createdScript._id,
      });
      expect(scriptFindOneById._id).toBeDefined();

      await service.deleteOne(scriptFindOneById._id);

      const scriptFindOneByIdAfterDelete = await service.findOne({
        _id: createdScript._id,
      });
      expect(scriptFindOneByIdAfterDelete).toEqual(null);
    });
  });
});
