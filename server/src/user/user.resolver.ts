import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../auth/auth-user.decorator';
import { AuthGqlGuard } from '../auth/auth.gql.guard';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import { UserInput, UserInputFilter, UserInputUpdate } from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

export const usersQueryResolver = () => [User];
export const userQueryResolver = () => User;
export const userMutationResolver = () => User;

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly caslService: CaslService,
  ) {}

  @Query(usersQueryResolver)
  @UseGuards(AuthGqlGuard)
  async users(@AuthUser() user: User) {
    await this.checkAbility(user);

    return this.userService.findAll();
  }

  @Query(userQueryResolver)
  @UseGuards(AuthGqlGuard)
  async user(@Args('input') input: UserInputFilter, @AuthUser() user: User) {
    await this.checkAbility(user);

    const foundUser = await this.userService.findOne(input);

    if (foundUser == null) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  @Mutation(userMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createUser(
    @Args('input') input: UserInput,
    @AuthUser() user: User,
  ): Promise<User> {
    await this.checkAbility(user);

    return this.userService.create({
      ...input,
      createdBy: user._id as string,
    });
  }

  @Mutation(userMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateUser(
    @Args('input') input: UserInputUpdate,
    @AuthUser() user: User,
  ): Promise<User> {
    await this.checkAbility(user);

    const { ...inputUpdate } = input;

    // do not allow createdBy override
    delete inputUpdate.createdBy;

    return this.userService.update({
      ...inputUpdate,
      updatedBy: user._id as string,
    });
  }

  @Mutation(userMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteUser(
    @Args('id') id: string,
    @AuthUser() user: User,
  ): Promise<User> {
    await this.checkAbility(user);

    return this.userService.deleteOne(id);
  }

  private async checkAbility(user: User) {
    return this.caslService.hasAbilityOrThrow(user, CaslAction.Manage, 'all');
  }
}
