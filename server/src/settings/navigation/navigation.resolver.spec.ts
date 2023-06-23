import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockUser } from '../../../test/helpers/user.dto.helper';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import { NavigationLink } from './navigation.dto';
import {
  navigationLinksQueryResolver,
  navigationMutationResolver,
  navigationQueryResolver,
  NavigationResolver,
  navigationsQueryResolver,
} from './navigation.resolver';
import { Navigation } from './navigation.schema';
import { NavigationService } from './navigation.service';

jest.mock('./navigation.service');
jest.mock('../../casl/casl.service');

describe('NavigationResolver', () => {
  let resolver: NavigationResolver;
  let navigationService: NavigationService;
  let caslService: CaslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NavigationResolver, NavigationService, CaslService],
    }).compile();

    resolver = module.get<NavigationResolver>(NavigationResolver);
    navigationService = module.get<NavigationService>(NavigationService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('navigations', () => {
    it('should call service findAll navigations', async () => {
      await resolver.navigations();
      expect(navigationService.findAll).toBeCalled();
      expect(navigationsQueryResolver()).toEqual([Navigation]);
    });
  });

  describe('navigation', () => {
    describe('when navigation exits', () => {
      it('should return it', async () => {
        const mockInput = { name: 'bar' };
        const mockResolvedNav = {
          name: 'bar',
          items: [],
        };
        (navigationService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedNav,
        );
        const result = await resolver.navigation(mockInput);

        expect(navigationService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedNav);
        expect(navigationQueryResolver()).toEqual(Navigation);
      });
    });

    describe('when navigation does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { name: 'foo' };
        (navigationService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.navigation(mockInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('Navigation not found'));
        }
      });
    });
  });

  describe('createNavigation', () => {
    it('should call service create navigation passing input and user id as authorId', async () => {
      const mockInput = { name: 'test', items: [] };
      const user = mockUser();

      await resolver.createNavigation(mockInput, user);
      expect(navigationService.create).toHaveBeenLastCalledWith({
        authorId: user._id,
        ...mockInput,
      });
      expect(navigationMutationResolver()).toEqual(Navigation);
    });
  });

  describe('updateNavigation', () => {
    describe('when navigation exists', () => {
      it('should call service update passing input', async () => {
        const updateNavigationInput = {
          _id: new Types.ObjectId(),
          name: 'updateme',
        };
        const mockReqUser = mockUser();
        const mockNavigation = new Navigation();
        mockNavigation.authorId = mockReqUser._id;
        (navigationService.findOne as jest.Mock).mockResolvedValueOnce(
          mockNavigation,
        );
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );

        await resolver.updateNavigation(updateNavigationInput, mockReqUser);

        expect(navigationService.findOne).toHaveBeenLastCalledWith({
          _id: updateNavigationInput._id,
        });
        expect(navigationService.update).toHaveBeenLastCalledWith(
          updateNavigationInput,
        );
        expect(navigationMutationResolver()).toEqual(Navigation);
        expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
          mockReqUser,
          CaslAction.Update,
          mockNavigation,
        );
      });
    });

    describe('when navigation does NOT exists', () => {
      it('should throw navigation not found', async () => {
        const updateNavigationInput = {
          _id: new Types.ObjectId(),
          name: 'updatenotexists',
        };
        const mockReqUser = mockUser();
        const mockNavigation = new Navigation();
        mockNavigation.authorId = mockReqUser._id;
        (navigationService.findOne as jest.Mock).mockResolvedValueOnce(null);
        (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
          undefined,
        );
        expect.assertions(4);

        try {
          await resolver.updateNavigation(updateNavigationInput, mockReqUser);
        } catch (error) {
          expect(navigationService.findOne).toHaveBeenLastCalledWith({
            _id: updateNavigationInput._id,
          });
          expect(navigationService.update).not.toHaveBeenCalled();
          expect(navigationMutationResolver()).toEqual(Navigation);
          expect(caslService.hasAbilityOrThrow).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('deleteNavigation', () => {
    it('should call service delete navigation passing navigation id if allowed by ability check', async () => {
      const mockNavId = new Types.ObjectId().toString();
      const mockReqUser = mockUser();
      const mockNav = new Navigation();
      mockNav.authorId = mockReqUser._id;
      (navigationService.findOne as jest.Mock).mockResolvedValueOnce(mockNav);
      (caslService.hasAbilityOrThrow as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await resolver.deleteArticle(mockNavId, mockReqUser);

      expect(navigationService.deleteOne).toHaveBeenLastCalledWith(mockNavId);
      expect(navigationService.findOne).toHaveBeenLastCalledWith({
        _id: mockNavId,
      });
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Delete,
        mockNav,
      );
    });
  });

  describe('links', () => {
    it('should call service passing navigation', async () => {
      (navigationService.resolveLinks as jest.Mock).mockResolvedValueOnce([]);
      const mockNav = { name: 'test', items: [] };
      const result = await resolver.links(mockNav as any);

      expect(navigationService.resolveLinks).toHaveBeenLastCalledWith(mockNav);
      expect(result).toEqual([]);
      expect(navigationLinksQueryResolver()).toEqual([NavigationLink]);
    });
  });
});
