import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGqlGuard } from '../auth/auth.gql.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.schema';
import { PageInput, PageInputFilter, PageInputUpdate } from './page.dto';
import { Page } from './page.schema';
import { PageService } from './page.service';
import { AuthUserDecoded } from '../auth/auth.interface';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import { AppSchemaId } from '../common/common.interface';

export const pagesQueryResolver = () => [Page];
export const pagesCountQueryResolver = () => Number;
export const pageQueryResolver = () => Page;
export const pageMutationResolver = () => Page;
export const pageTitleOrSlugQueryResultResolver = () => [Page];

@Resolver()
export class PageResolver {
  constructor(
    private readonly pageService: PageService,
    private readonly caslService: CaslService,
  ) {}

  @Query(pagesQueryResolver)
  async pages() {
    return this.pageService.findAll();
  }

  @Query(pagesCountQueryResolver)
  async pagesCount() {
    return this.pageService.count();
  }

  @Query(pageQueryResolver)
  async page(@Args('input') input: PageInputFilter) {
    const foundPage = await this.pageService.findOne(input);

    if (foundPage == null) {
      throw new NotFoundException('Page not found');
    }
    return foundPage;
  }

  @Query(pageTitleOrSlugQueryResultResolver)
  async findPagesByTitleOrSlug(@Args('arg') arg: string) {
    return this.pageService.findManyByTitleOrSlug(arg);
  }

  @Mutation(pageMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createPage(@Args('input') input: PageInput, @AuthUser() user: User) {
    return this.pageService.create({ authorId: user._id, ...input });
  }

  @Mutation(pageMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updatePage(
    @Args('input') input: PageInputUpdate,
    @AuthUser() user: User,
  ): Promise<Page> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.pageService.update(input);
  }

  @Mutation(pageMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deletePage(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.pageService.deleteOne(id);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const page = await this.pageService.findOne({ _id });

    if (page == null) {
      throw new NotFoundException('Page not found');
    }
    const pageCheck = new Page();

    pageCheck.authorId = page.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, pageCheck);
  }
}
