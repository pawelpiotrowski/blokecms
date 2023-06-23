import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import {
  scriptMutationResolver,
  scriptQueryResolver,
  ScriptResolver,
  scriptsQueryResolver,
} from './script.resolver';
import { Script } from './script.schema';
import { ScriptService } from './script.service';

jest.mock('./script.service');
jest.mock('../../casl/casl.service');

describe('ScriptResolver', () => {
  let resolver: ScriptResolver;
  let scriptService: ScriptService;
  let caslService: CaslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptResolver, ScriptService, CaslService],
    }).compile();

    resolver = module.get<ScriptResolver>(ScriptResolver);
    scriptService = module.get<ScriptService>(ScriptService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('scripts', () => {
    it('should call service findAll scripts', async () => {
      await resolver.scripts();
      expect(scriptService.findAll).toBeCalled();
      expect(scriptsQueryResolver()).toEqual([Script]);
    });
  });

  describe('script', () => {
    describe('when script exits', () => {
      it('should return it', async () => {
        const mockInput = { name: 'bar' };
        const mockResolvedNav = {
          name: 'bar',
          formatted: 'let foo = 0;',
        };
        (scriptService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedNav,
        );
        const result = await resolver.script(mockInput);

        expect(scriptService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedNav);
        expect(scriptQueryResolver()).toEqual(Script);
      });
    });

    describe('when script does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { name: 'foo' };
        (scriptService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.script(mockInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('Script not found'));
        }
      });
    });
  });

  describe('createScript', () => {
    it('should call service create script passing input and user id as authorId', async () => {
      const mockInput = { name: 'test', formatted: '' };
      const user = mockUser();

      await resolver.createScript(mockInput, user);
      expect(scriptService.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        ...mockInput,
      });
      expect(scriptMutationResolver()).toEqual(Script);
    });
  });

  describe('deleteScript', () => {
    it('should call service delete script passing script id if allowed by ability check', async () => {
      const mockScriptId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockScript = new Script();
      mockScript.authorId = mockReqUser._id;
      (scriptService.findOne as jest.Mock).mockResolvedValueOnce(mockScript);
      (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await resolver.deleteScript(mockScriptId, mockReqUser);

      expect(scriptService.deleteOne).toHaveBeenLastCalledWith(mockScriptId);
      expect(scriptService.findOne).toHaveBeenLastCalledWith({
        _id: mockScriptId,
      });
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockScript,
      );
    });
  });

  describe('updateScript', () => {
    describe('when script exists', () => {
      it('should call service update passing input', async () => {
        const updateScriptInput = {
          _id: new Types.ObjectId(),
          name: 'updateme',
        };
        const mockReqUser = mockUser();
        const mockScript = new Script();
        mockScript.authorId = mockReqUser._id;
        (scriptService.findOne as jest.Mock).mockResolvedValueOnce(mockScript);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );

        await resolver.updateScript(updateScriptInput, mockReqUser);

        expect(scriptService.findOne).toHaveBeenLastCalledWith({
          _id: updateScriptInput._id,
        });
        expect(scriptService.update).toHaveBeenLastCalledWith(
          updateScriptInput,
        );
        expect(scriptMutationResolver()).toEqual(Script);
        expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
          mockReqUser,
          CaslAction.Update,
          mockScript,
        );
      });
    });

    describe('when script does NOT exists', () => {
      it('should throw script not found', async () => {
        const updateScriptInput = {
          _id: new Types.ObjectId(),
          name: 'updatenotexists',
        };
        const mockReqUser = mockUser();
        const mockScript = new Script();
        mockScript.authorId = mockReqUser._id;
        (scriptService.findOne as jest.Mock).mockResolvedValueOnce(null);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );
        expect.assertions(4);

        try {
          await resolver.updateScript(updateScriptInput, mockReqUser);
        } catch (error) {
          expect(scriptService.findOne).toHaveBeenLastCalledWith({
            _id: updateScriptInput._id,
          });
          expect(scriptService.update).not.toHaveBeenCalled();
          expect(scriptMutationResolver()).toEqual(Script);
          expect(caslService.hasAbilityOrThrow).not.toHaveBeenCalled();
        }
      });
    });
  });
});
