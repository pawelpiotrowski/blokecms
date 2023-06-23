import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { mockUser, mockUserInput } from '../../test/helpers/user.dto.helper';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import {
  userMutationResolver,
  userQueryResolver,
  UserResolver,
  usersQueryResolver,
} from './user.resolver';
import { User } from './user.schema';
import { UserService } from './user.service';

jest.mock('./user.service');
jest.mock('../casl/casl.service');

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let caslService: CaslService;
  const mockReqUser = mockUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService, CaslService],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    caslService = module.get<CaslService>(CaslService);
  });

  describe('users', () => {
    it('should call service findAll', async () => {
      await resolver.users(mockReqUser);
      expect(userService.findAll).toBeCalled();
      expect(usersQueryResolver()).toEqual([User]);
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Manage,
        'all',
      );
    });
  });

  describe('user', () => {
    describe('when user exits', () => {
      it('should return it', async () => {
        const mockInput = { username: 'bar' };
        const mockResolvedUser = mockUser();
        (userService.findOne as jest.Mock).mockResolvedValueOnce(
          mockResolvedUser,
        );
        const result = await resolver.user(mockInput, mockReqUser);

        expect(userService.findOne).toHaveBeenLastCalledWith(mockInput);
        expect(result).toEqual(mockResolvedUser);
        expect(userQueryResolver()).toEqual(User);
      });
    });

    describe('when user does NOT exits', () => {
      it('should throw not found exception', async () => {
        expect.assertions(2);
        const mockInput = { username: 'foo' };
        (userService.findOne as jest.Mock).mockResolvedValueOnce(null);
        try {
          await resolver.user(mockInput, mockReqUser);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error).toEqual(new NotFoundException('User not found'));
        }
      });
    });
  });

  describe('createUser', () => {
    it('should call service create passing input', async () => {
      const createUserInput = mockUserInput();

      await resolver.createUser(createUserInput, mockReqUser);
      expect(userService.create).toHaveBeenLastCalledWith({
        ...createUserInput,
        createdBy: mockReqUser._id,
      });
      expect(userMutationResolver()).toEqual(User);
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Manage,
        'all',
      );
    });
  });

  describe('updateUser', () => {
    it('should call service update passing input', async () => {
      const updateUserInput = {
        _id: new Types.ObjectId(),
        username: 'foo',
        createdBy: '123',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdBy, ...restUpdateInput } = updateUserInput;

      await resolver.updateUser(updateUserInput, mockReqUser);
      expect(userService.update).toHaveBeenLastCalledWith({
        ...restUpdateInput,
        updatedBy: mockReqUser._id,
      });
      expect(userMutationResolver()).toEqual(User);
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Manage,
        'all',
      );
    });
  });

  describe('deleteUser', () => {
    it('should call service delete passing id', async () => {
      const _id = new Types.ObjectId().toString();

      await resolver.deleteUser(_id, mockReqUser);
      expect(userService.deleteOne).toHaveBeenLastCalledWith(_id);
      expect(userMutationResolver()).toEqual(User);
      expect(caslService.hasAbilityOrThrow).toHaveBeenLastCalledWith(
        mockReqUser,
        CaslAction.Manage,
        'all',
      );
    });
  });
});
