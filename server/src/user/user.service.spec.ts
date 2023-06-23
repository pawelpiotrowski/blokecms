import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/helpers/mongoose.helper';
import { mockUserInput } from '../../test/helpers/user.dto.helper';
import { appConfig, appConfigNameSpace } from '../app.config';
import { DotEnvVar } from '../app.config.interface';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

const config = appConfig();
const mockConfigService = {
  get: (arg: string) => {
    if (arg === appConfigNameSpace) {
      return config;
    }
    return mockConfigService[arg];
  },
};
// mockConfigService[DotEnvVar.adminSeedUserName] = 'test-auth-cookie-name';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  const createUserInput = mockUserInput();
  let createdUser: User;

  const setTestModule = async (enableSeed: boolean) => {
    if (enableSeed) {
      mockConfigService[DotEnvVar.adminSeedUserName] = 'test-auth-cookie-name';
    }
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [
        UserService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  };

  const cleanUpAfterAll = async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  };

  describe('public', () => {
    beforeAll(async () => {
      await setTestModule(false);
    });

    afterAll(async () => {
      await cleanUpAfterAll();
    });

    describe('create', () => {
      it('should create an user with UserInput', async () => {
        createdUser = await service.create(createUserInput);
        const userPasswordMatch = await bcrypt.compare(
          createUserInput.password,
          createdUser.password,
        );

        expect(createdUser._id).toBeDefined();
        expect(createdUser.username).toBe(createUserInput.username);
        expect(userPasswordMatch).toBe(true);
      });
    });

    describe('findAll', () => {
      it('should get a list of users', async () => {
        const users = await service.findAll();

        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(1);
        expect(users[0].username).toBe(createUserInput.username);
      });
    });

    describe('verify', () => {
      it('should return User for correct credentials', async () => {
        const user = await service.verify(createUserInput);

        expect(user).toBeDefined();
        expect(user.username).toBe(createUserInput.username);
      });

      it('should return null if username or password are not matching', async () => {
        const user1 = await service.verify({
          username: 'hello',
          password: createUserInput.password,
        });

        expect(user1).toBeNull();

        const user2 = await service.verify({
          username: createUserInput.username,
          password: 'hello',
        });

        expect(user2).toBeNull();
      });
    });

    describe('exists', () => {
      it('should return user exists boolean', async () => {
        const { _id, username } = createdUser;
        const userExistsById = await service.exists({ _id });
        const userExistsByStringId = await service.exists({
          _id: _id.toString(),
        } as any);
        const userShouldNotExistsByStringId = await service.exists({
          _id: new Types.ObjectId().toString(),
        } as any);
        const userExistsByUsername = await service.exists({ username });
        const userDoesNotExistsById = await service.exists({
          _id: new Types.ObjectId(),
        });
        const userDoesNotExistsByUsername = await service.exists({
          username: 'i dont exists',
        });

        expect(userExistsById).toEqual(true);
        expect(userExistsByUsername).toEqual(true);
        expect(userExistsByStringId).toEqual(true);
        expect(userShouldNotExistsByStringId).toEqual(false);
        expect(userDoesNotExistsById).toEqual(false);
        expect(userDoesNotExistsByUsername).toEqual(false);
      });
    });

    describe('findOne', () => {
      it('should return a user if exists otherwise null', async () => {
        const { _id, username } = createdUser;
        const userFindOneById = await service.findOne({ _id });
        const userFindOneByStringId = await service.findOne({
          _id: _id.toString(),
        });
        const userFindOneByUsername = await service.findOne({ username });
        const userShouldNotExistsById = await service.findOne({
          _id: new Types.ObjectId(),
        } as any);
        const userShouldNotExistsByUsername = await service.findOne({
          username: 'i dont exists',
        });

        expect(userFindOneById.username).toEqual(username);
        expect(userFindOneByStringId.username).toEqual(username);
        expect(userFindOneByUsername._id.toString()).toEqual(_id.toString());
        expect(userShouldNotExistsById).toEqual(null);
        expect(userShouldNotExistsByUsername).toEqual(null);
      });
    });

    describe('deleteOne', () => {
      it('should delete user by id', async () => {
        const createdUser = await service.create(mockUserInput());

        const userFindOneById = await service.findOne({
          _id: createdUser._id,
        });
        expect(userFindOneById._id).toBeDefined();

        await service.deleteOne(userFindOneById._id);

        const userFindOneByIdAfterDelete = await service.findOne({
          _id: createdUser._id,
        });
        expect(userFindOneByIdAfterDelete).toEqual(null);
      });
    });

    describe('update', () => {
      it('should update user', async () => {
        const createdUser = await service.create(mockUserInput());
        const mockUpdate = {
          _id: createdUser._id,
          username: 'foo-bar',
          isAdmin: !createdUser.isAdmin,
        };
        const updatedUser = await service.update(mockUpdate);
        const findUpdatedUser = await service.findOne({
          _id: createdUser._id,
        });
        expect(updatedUser.username).toEqual(findUpdatedUser.username);
        expect(findUpdatedUser.isAdmin).toEqual(mockUpdate.isAdmin);
      });
    });
  });

  describe('private', () => {
    describe('seedAdminUser disabled', () => {
      beforeAll(async () => {
        await setTestModule(false);
      });

      afterAll(async () => {
        await cleanUpAfterAll();
      });
      it('should not attempt to seed admin user', async () => {
        jest.spyOn(service, 'exists');
        jest.spyOn(service, 'create');

        await service.onApplicationBootstrap();

        expect(service.exists).not.toBeCalled();
        expect(service.create).not.toBeCalled();
      });
    });

    describe('seedAdminUser enabled', () => {
      beforeAll(async () => {
        await setTestModule(true);
      });

      afterAll(async () => {
        await cleanUpAfterAll();
      });

      it('should attempt to seed admin user', async () => {
        jest.spyOn(service, 'exists');
        jest.spyOn(service, 'create');

        await service.onApplicationBootstrap();

        expect(service.exists).toHaveBeenLastCalledWith({
          username: mockConfigService[DotEnvVar.adminSeedUserName],
        });
        expect(service.create).toHaveBeenLastCalledWith({
          username: mockConfigService[DotEnvVar.adminSeedUserName],
          password: expect.any(String),
          isAdmin: true,
          createdBy: expect.any(String),
        });
      });

      it('should NOT attempt to seed admin user if user already exists', async () => {
        jest.spyOn(service, 'exists').mockResolvedValueOnce(true);
        jest.spyOn(service, 'create').mockClear();

        await service.onApplicationBootstrap();

        expect(service.exists).toHaveBeenLastCalledWith({
          username: mockConfigService[DotEnvVar.adminSeedUserName],
        });
        expect(service.create).not.toBeCalled();
      });
    });
  });
});
