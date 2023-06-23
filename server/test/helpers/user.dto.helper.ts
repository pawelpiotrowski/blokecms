import * as Chance from 'chance';
import { Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserInput } from '../../src/user/user.dto';

const chance = new Chance();

export const mockUserInput = (): UserInput => ({
  username: chance.name(),
  password: chance.guid(),
});

export const mockUser = (): Omit<User, 'password'> => ({
  _id: new Types.ObjectId().toString(),
  username: chance.name(),
  createdAt: chance.date(),
  updatedAt: chance.date(),
});

export const mockAdminUser = (): Omit<User, 'password'> => ({
  _id: new Types.ObjectId().toString(),
  username: chance.name(),
  isAdmin: true,
  createdAt: chance.date(),
  updatedAt: chance.date(),
});
