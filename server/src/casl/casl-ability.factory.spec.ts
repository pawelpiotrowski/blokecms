import { Test, TestingModule } from '@nestjs/testing';
import * as Chance from 'chance';
import { Block } from '../block/block.schema';
import { Page } from '../page/page.schema';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAction } from './casl.interface';

jest.mock('../user/user.service');
const chance = new Chance();

describe('CaslAbilityFactory', () => {
  let caslFactory: CaslAbilityFactory;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactory, UserService],
    }).compile();

    caslFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
    userService = module.get<UserService>(UserService);
  });

  describe('createForUser', () => {
    it('should call user service to find one using decoded user _id', async () => {
      const mockUser = {
        _id: '1',
        username: '2',
        createdAt: chance.date(),
        updatedAt: chance.date(),
      };
      (userService.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      await caslFactory.createForUser(mockUser);

      expect(userService.findOne).toHaveBeenLastCalledWith({
        _id: mockUser._id,
      });
    });

    it('should return manage all ability for admin', async () => {
      const mockUser = {
        _id: '3',
        username: '4',
        createdAt: chance.date(),
        updatedAt: chance.date(),
      };
      (userService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        isAdmin: true,
      });
      const ability = await caslFactory.createForUser(mockUser);

      expect(ability.can(CaslAction.Manage, 'all')).toEqual(true);
      expect(ability.can(CaslAction.Read, 'all')).toEqual(true);
    });

    it('should return read all ability for NON admin', async () => {
      const mockUser = {
        _id: '5',
        username: '6',
        createdAt: chance.date(),
        updatedAt: chance.date(),
      };

      (userService.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      const ability = await caslFactory.createForUser(mockUser);

      expect(ability.can(CaslAction.Manage, 'all')).toEqual(false);
      expect(ability.can(CaslAction.Read, 'all')).toEqual(true);
    });
  });

  describe('createForUser with Page', () => {
    it('should return true for admin and page author', async () => {
      const mockUser = {
        _id: '7',
        username: '8',
        createdAt: chance.date(),
        updatedAt: chance.date(),
      };
      const mockAdminUser = {
        _id: '9',
        username: '0',
        createdAt: chance.date(),
        updatedAt: chance.date(),
      };
      const mockPageForUser = new Page();
      const mockPageForOtherUser = new Page();
      const mockBlockForUser = new Block();
      const mockBlockForOtherUser = new Block();
      mockPageForUser.authorId = mockUser._id;
      mockBlockForUser.authorId = mockUser._id;
      mockPageForOtherUser.authorId = '10';
      mockBlockForOtherUser.authorId = '10';

      (userService.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      const ability = await caslFactory.createForUser(mockUser);

      expect(ability.can(CaslAction.Delete, mockPageForUser)).toEqual(true);
      expect(ability.can(CaslAction.Update, mockPageForUser)).toEqual(true);
      expect(ability.can(CaslAction.Delete, mockBlockForUser)).toEqual(true);
      expect(ability.can(CaslAction.Update, mockBlockForUser)).toEqual(true);
      expect(ability.can(CaslAction.Delete, mockPageForOtherUser)).toEqual(
        false,
      );
      expect(ability.can(CaslAction.Update, mockPageForOtherUser)).toEqual(
        false,
      );
      expect(ability.can(CaslAction.Delete, mockBlockForOtherUser)).toEqual(
        false,
      );
      expect(ability.can(CaslAction.Update, mockBlockForOtherUser)).toEqual(
        false,
      );

      (userService.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockAdminUser,
        isAdmin: true,
      });
      const adminAbility = await caslFactory.createForUser(mockAdminUser);

      expect(adminAbility.can(CaslAction.Delete, mockPageForUser)).toEqual(
        true,
      );
      expect(adminAbility.can(CaslAction.Delete, mockBlockForUser)).toEqual(
        true,
      );
      expect(adminAbility.can(CaslAction.Update, mockPageForUser)).toEqual(
        true,
      );
      expect(adminAbility.can(CaslAction.Update, mockBlockForUser)).toEqual(
        true,
      );
      expect(adminAbility.can(CaslAction.Delete, mockPageForOtherUser)).toEqual(
        true,
      );
      expect(
        adminAbility.can(CaslAction.Delete, mockBlockForOtherUser),
      ).toEqual(true);
      expect(adminAbility.can(CaslAction.Update, mockPageForOtherUser)).toEqual(
        true,
      );
      expect(
        adminAbility.can(CaslAction.Update, mockBlockForOtherUser),
      ).toEqual(true);
    });
  });
});
