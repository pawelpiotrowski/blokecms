import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import {
  styleMutationResolver,
  styleQueryResolver,
  StyleResolver,
  stylesQueryResolver,
} from './style.resolver';
import { Style } from './style.schema';
import { StyleService } from './style.service';

jest.mock('./style.service');
jest.mock('../../casl/casl.service');

describe('StyleResolver', () => {
  let resolver: StyleResolver;
  let styleService: StyleService;
  let caslService: CaslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StyleResolver, StyleService, CaslService],
    }).compile();

    resolver = module.get<StyleResolver>(StyleResolver);
    styleService = module.get<StyleService>(StyleService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('styles', () => {
    it('should call service findAll styles', async () => {
      await resolver.styles();
      expect(styleService.findAll).toBeCalled();
      expect(stylesQueryResolver()).toEqual([Style]);
    });
  });

  describe('style', () => {
    describe('when style exits', () => {
      it('should return it', async () => {
        const mockInput = { name: 'bar' };
        const mockResolvedNav = {
          name: 'bar',
          formatted: 'html { margin: 0; }',
        };
        (styleService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedNav,
        );
        const result = await resolver.style(mockInput);

        expect(styleService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedNav);
        expect(styleQueryResolver()).toEqual(Style);
      });
    });

    describe('when style does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { name: 'foo' };
        (styleService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.style(mockInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('Style not found'));
        }
      });
    });
  });

  describe('createStyle', () => {
    it('should call service create style passing input and user id as authorId', async () => {
      const mockInput = { name: 'test', formatted: '' };
      const user = mockUser();

      await resolver.createStyle(mockInput, user);
      expect(styleService.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        ...mockInput,
      });
      expect(styleMutationResolver()).toEqual(Style);
    });
  });

  describe('deleteStyle', () => {
    it('should call service delete style passing style id if allowed by ability check', async () => {
      const mockStyleId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockStyle = new Style();
      mockStyle.authorId = mockReqUser._id;
      (styleService.findOne as jest.Mock).mockResolvedValueOnce(mockStyle);
      (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await resolver.deleteStyle(mockStyleId, mockReqUser);

      expect(styleService.deleteOne).toHaveBeenLastCalledWith(mockStyleId);
      expect(styleService.findOne).toHaveBeenLastCalledWith({
        _id: mockStyleId,
      });
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockStyle,
      );
    });
  });

  describe('updateStyle', () => {
    describe('when style exists', () => {
      it('should call service update passing input', async () => {
        const updateStyleInput = {
          _id: new Types.ObjectId(),
          name: 'updateme',
        };
        const mockReqUser = mockUser();
        const mockStyle = new Style();
        mockStyle.authorId = mockReqUser._id;
        (styleService.findOne as jest.Mock).mockResolvedValueOnce(mockStyle);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );

        await resolver.updateStyle(updateStyleInput, mockReqUser);

        expect(styleService.findOne).toHaveBeenLastCalledWith({
          _id: updateStyleInput._id,
        });
        expect(styleService.update).toHaveBeenLastCalledWith(updateStyleInput);
        expect(styleMutationResolver()).toEqual(Style);
        expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
          mockReqUser,
          CaslAction.Update,
          mockStyle,
        );
      });
    });

    describe('when style does NOT exists', () => {
      it('should throw style not found', async () => {
        const updateStyleInput = {
          _id: new Types.ObjectId(),
          name: 'updatenotexists',
        };
        const mockReqUser = mockUser();
        const mockStyle = new Style();
        mockStyle.authorId = mockReqUser._id;
        (styleService.findOne as jest.Mock).mockResolvedValueOnce(null);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );
        expect.assertions(4);

        try {
          await resolver.updateStyle(updateStyleInput, mockReqUser);
        } catch (error) {
          expect(styleService.findOne).toHaveBeenLastCalledWith({
            _id: updateStyleInput._id,
          });
          expect(styleService.update).not.toHaveBeenCalled();
          expect(styleMutationResolver()).toEqual(Style);
          expect(caslService.hasAbilityOrThrow).not.toHaveBeenCalled();
        }
      });
    });
  });
});
