import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { DotEnvVar } from '../app.config.interface';
import { AppSchemaId } from '../common/common.interface';
import { UserInput, UserInputFilter, UserInputUpdate } from './user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.isAppConfigAdminSeedRequested()) {
      await this.seedAdminUser();
    }
  }

  async create(input: UserInput) {
    return this.userModel.create(input);
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async verify({ username, password }: UserInput): Promise<User | null> {
    const user = await this.userModel
      .findOne({ username })
      .select('+password')
      .exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async exists(filter: UserInputFilter): Promise<boolean> {
    return (await this.userModel.count(filter).exec()) > 0;
  }

  async findOne(filter: UserInputFilter) {
    return this.userModel.findOne(filter).exec();
  }

  async deleteOne(id: AppSchemaId) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async update(input: UserInputUpdate): Promise<User> {
    const { _id, ...userUpdateInput } = input;

    return this.userModel
      .findByIdAndUpdate(_id, userUpdateInput, { new: true })
      .exec();
  }

  private async seedAdminUser() {
    if (await this.exists({ username: this.appConfigAdminSeedUserName() })) {
      Logger.warn(
        `Skipping admin seed. User "${this.appConfigAdminSeedUserName}" already exists.`,
      );
      return;
    }
    const password = crypto.randomBytes(20).toString('hex');

    await this.create({
      username: this.appConfigAdminSeedUserName(),
      password,
      isAdmin: true,
      createdBy: new Types.ObjectId().toString(),
    });
    Logger.warn(`Admin seed created pwd: "${password}"`);
  }

  private isAppConfigAdminSeedRequested() {
    return (
      typeof this.appConfigAdminSeedUserName() === 'string' &&
      this.appConfigAdminSeedUserName().length > 0
    );
  }

  private appConfigAdminSeedUserName() {
    return this.configService.get<string>(DotEnvVar.adminSeedUserName);
  }
}
