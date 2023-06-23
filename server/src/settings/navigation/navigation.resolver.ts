import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthGqlGuard } from '../../auth/auth.gql.guard';
import { AuthUserDecoded } from '../../auth/auth.interface';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';
import {
  NavigationInput,
  NavigationInputFilter,
  NavigationInputUpdate,
  NavigationLink,
} from './navigation.dto';
import { Navigation } from './navigation.schema';
import { NavigationService } from './navigation.service';

export const navigationsQueryResolver = () => [Navigation];
export const navigationQueryResolver = () => Navigation;
export const navigationMutationResolver = () => Navigation;
export const navigationLinksQueryResolver = () => [NavigationLink];

@Resolver(() => Navigation)
export class NavigationResolver {
  constructor(
    private readonly navigationService: NavigationService,
    private readonly caslService: CaslService,
  ) {}

  @Query(navigationsQueryResolver)
  async navigations() {
    return this.navigationService.findAll();
  }

  @Query(navigationQueryResolver)
  async navigation(@Args('input') input: NavigationInputFilter) {
    const foundNavigation = await this.navigationService.findOne(input);

    if (foundNavigation == null) {
      throw new NotFoundException('Navigation not found');
    }
    return foundNavigation;
  }

  @Mutation(navigationMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createNavigation(
    @Args('input') input: NavigationInput,
    @AuthUser() user: User,
  ) {
    return this.navigationService.create({ authorId: user._id, ...input });
  }

  @Mutation(navigationMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateNavigation(
    @Args('input') input: NavigationInputUpdate,
    @AuthUser() user: User,
  ): Promise<Navigation> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.navigationService.update(input);
  }

  @Mutation(navigationMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteArticle(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.navigationService.deleteOne(id);
  }

  @ResolveField(navigationLinksQueryResolver)
  async links(@Parent() navigation: Navigation) {
    return this.navigationService.resolveLinks(navigation);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const navigation = await this.navigationService.findOne({ _id });

    if (navigation == null) {
      throw new NotFoundException('Navigation not found');
    }
    const navigationCheck = new Navigation();

    navigationCheck.authorId = navigation.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, navigationCheck);
  }
}
