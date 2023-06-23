import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/helpers/mongoose.helper';
import { mockUserInput } from '../../test/helpers/user.dto.helper';
import { appConfig, appConfigNameSpace } from '../app.config';
import { AppConfig, DotEnvVar } from '../app.config.interface';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { AuthService } from './auth.service';
import { Types } from 'mongoose';
import { CaslService } from '../casl/casl.service';
import { CaslModule } from '../casl/casl.module';

// casl stuff is needed for user module
jest.mock('../casl/casl.service');

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let jwtService: JwtService;
  let userService: UserService;
  let configService: ConfigService;
  const createUserInput = mockUserInput();
  let seedUser: User;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UserModule,
        CaslModule,
        ConfigModule.forRoot({
          envFilePath: '../../test/.auth-test.env',
          load: [appConfig],
          isGlobal: true,
          cache: true,
        }),
      ],
      providers: [
        AuthService,
        CaslService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    // seed user
    seedUser = await userService.create(createUserInput);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    // make sure we have seed user
    expect((await userService.findAll()).length).toEqual(1);
  });

  describe('login', () => {
    it('should return null for non verified user', async () => {
      const login = await service.login({ username: 'foo', password: 'bar' });

      expect(login).toBeNull();
    });

    it('should return auth and refresh jwt tokens for verified user', async () => {
      const spyOnJwtServiceSign = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');
      const login = await service.login(createUserInput);
      const expectedCalledWith = {
        sub: seedUser._id,
        usr: seedUser.username,
      };

      expect(login).toEqual({ auth: 'token', refresh: 'token' });
      expect(spyOnJwtServiceSign).toBeCalledTimes(2);
      expect(spyOnJwtServiceSign).toHaveBeenNthCalledWith(
        1,
        expectedCalledWith,
      );
      expect(spyOnJwtServiceSign).toHaveBeenNthCalledWith(
        2,
        {
          ...expectedCalledWith,
          ref: true,
        },
        {
          secret: configService.get<string>(DotEnvVar.jwtKey),
          expiresIn:
            configService.get<AppConfig>(appConfigNameSpace).api.auth
              .refreshExpiresIn,
        },
      );
    });
  });

  describe('refresh', () => {
    it('should return null for non verified refresh token', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue('invalid');
      const refresh = await service.refresh('foo');

      expect(refresh).toBeNull();
    });

    it('should return null for non existing user', async () => {
      const mockRefreshToken = 'fooBar';
      const mockNonExistingUsrTokenDecoded = {
        // non existing id
        sub: new Types.ObjectId().toString(),
        usr: seedUser.username,
      };
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue(mockNonExistingUsrTokenDecoded);
      jest.spyOn(userService, 'exists');

      const refresh = await service.refresh(mockRefreshToken);

      expect(refresh).toBeNull();
      expect(userService.exists).toBeCalledWith({
        _id: mockNonExistingUsrTokenDecoded.sub,
      });
    });

    it('should return jwt token for verified user', async () => {
      const mockRefreshToken = 'bar';
      const mockNewAuthToken = 'foobar';
      const expectedCalledWith = {
        sub: seedUser._id,
        usr: seedUser.username,
      };
      const spyOnJwtServiceVerify = jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue(expectedCalledWith);
      const spyOnJwtServiceSign = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(mockNewAuthToken);
      const refresh = await service.refresh(mockRefreshToken);

      expect(refresh).toEqual(mockNewAuthToken);
      expect(spyOnJwtServiceSign).toHaveBeenLastCalledWith(expectedCalledWith);
      expect(spyOnJwtServiceVerify).toHaveBeenLastCalledWith(mockRefreshToken, {
        secret: configService.get<string>(DotEnvVar.jwtKey),
      });
    });
  });

  describe('whoami', () => {
    it('should return decoded user data and auth expiry time in ms', () => {
      // time now converted to epoch unix time (ms -> s)
      const epochTimeNow = Math.floor(new Date().getTime() / 1000);
      const twoMinutesInSec = 120;
      // add 120 seconds
      const mockExpiryEpochTime = epochTimeNow + twoMinutesInSec;
      const mockDecodedUser = { usr: 'foo', sub: 'bar' };
      const mockDecodedToken = {
        exp: mockExpiryEpochTime,
        iat: epochTimeNow,
        ...mockDecodedUser,
      };
      const mockPartialPayload = { expiresInMs: 0 };
      (jwtService.decode as jest.Mock).mockReturnValueOnce(mockDecodedToken);

      const result = service.whoami('some-token', mockPartialPayload);

      expect(jwtService.decode).toHaveBeenLastCalledWith('some-token');
      expect(result._id).toEqual(mockDecodedUser.sub);
      expect(result.username).toEqual(mockDecodedUser.usr);
      expect(Math.floor(result.expiresInMs / 1000)).toEqual(twoMinutesInSec);
    });

    it('should return null if token can not be decoded', () => {
      const mockPartialPayload = { expiresInMs: 0 };
      (jwtService.decode as jest.Mock).mockReturnValueOnce(null);

      const result1 = service.whoami('some-token', mockPartialPayload);
      expect(result1).toBeNull();

      (jwtService.decode as jest.Mock).mockReturnValueOnce('decoded-as-string');

      const result2 = service.whoami('some-token', mockPartialPayload);
      expect(result2).toBeNull();

      expect(jwtService.decode).toHaveBeenCalledTimes(2);
      expect(jwtService.decode).toHaveBeenCalledWith('some-token');
    });
  });

  describe('role', () => {
    it('should decode token, find user and return isAdmin prop', async () => {
      const mockResolvedUser: any = {
        _id: new Types.ObjectId(),
        username: 'foo',
        isAdmin: true,
      };
      const { _id: sub, username: usr } = mockResolvedUser;
      (jwtService.decode as jest.Mock).mockReturnValueOnce({ usr, sub });
      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValueOnce(mockResolvedUser);

      const result = await service.role('some-token');
      expect(result.isAdmin).toEqual(mockResolvedUser.isAdmin);
      expect(userService.findOne).toHaveBeenLastCalledWith({
        _id: mockResolvedUser._id,
      });
    });

    it('should return isAdmin false if user has no isAdmin prop set', async () => {
      const mockResolvedUser: any = {
        _id: new Types.ObjectId(),
        username: 'bar',
      };
      const { _id: sub, username: usr } = mockResolvedUser;
      (jwtService.decode as jest.Mock).mockReturnValueOnce({ usr, sub });
      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValueOnce(mockResolvedUser);

      const result = await service.role('some-other-token');
      expect(result.isAdmin).toEqual(false);
      expect(userService.findOne).toHaveBeenLastCalledWith({
        _id: mockResolvedUser._id,
      });
    });

    it('should return null if token can not be decoded', async () => {
      (jwtService.decode as jest.Mock).mockReturnValueOnce(null);

      const result = await service.role('some-token');
      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    const mockPwdChangeInput = {
      current: 'pwd123',
      new: 'foo123',
      confirm: 'foo123',
    };

    it('should return whoami user when password change is successful', async () => {
      const mockWhoAmiUser: any = { _id: '1', username: 'user' };

      jest.spyOn(userService, 'verify').mockResolvedValueOnce({} as any);
      jest.spyOn(userService, 'update').mockResolvedValueOnce({} as any);
      jest.spyOn(service, 'whoami').mockReturnValueOnce(mockWhoAmiUser);
      const result = await service.changePassword('token', mockPwdChangeInput);

      expect(result).toEqual(mockWhoAmiUser);
      expect(userService.update).toHaveBeenLastCalledWith({
        _id: mockWhoAmiUser._id,
        password: mockPwdChangeInput.new,
      });
    });

    it('should return null and return early if new and confirm password are not the same', async () => {
      jest.spyOn(userService, 'verify').mockResolvedValueOnce(null);
      const mockInvalidPwdChangeInput = {
        ...mockPwdChangeInput,
        confirm: 'hello',
      };
      const result = await service.changePassword(
        'token',
        mockInvalidPwdChangeInput,
      );

      expect(result).toEqual(null);
      expect(userService.verify).not.toHaveBeenCalled();
    });

    it('should return null if user can not be verified', async () => {
      const mockWhoAmiUser: any = { username: 'bar' };

      jest.spyOn(userService, 'verify').mockResolvedValueOnce(null);
      jest.spyOn(service, 'whoami').mockReturnValueOnce(mockWhoAmiUser);
      const result = await service.changePassword('token', mockPwdChangeInput);

      expect(result).toEqual(null);
      expect(service.whoami).toHaveBeenLastCalledWith('token');
      expect(userService.verify).toHaveBeenLastCalledWith({
        username: mockWhoAmiUser.username,
        password: mockPwdChangeInput.current,
      });
    });
  });

  describe('throwUnauthorized', () => {
    it('should throw unauthorized exception', () => {
      const testThrow = () => {
        service.throwUnauthorized();
      };
      expect(testThrow).toThrow(UnauthorizedException);
      expect(testThrow).toThrow(service['unauthorizedExceptionMsg']);
    });
  });

  describe('throwForbidden', () => {
    it('should throw unauthorized exception', () => {
      const testThrow = () => {
        service.throwForbidden();
      };
      expect(testThrow).toThrow(ForbiddenException);
      expect(testThrow).toThrow(service['forbiddenExceptionMsg']);
    });
  });
});
