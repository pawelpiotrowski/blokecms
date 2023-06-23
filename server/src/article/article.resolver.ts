import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGqlGuard } from '../auth/auth.gql.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.schema';
import { ArticleService } from './article.service';
import { CaslService } from '../casl/casl.service';
import { Article } from './article.schema';
import {
  ArticleInput,
  ArticleInputFilter,
  ArticleInputUpdate,
} from './article.dto';
import { CaslAction } from '../casl/casl.interface';
import { AuthUserDecoded } from '../auth/auth.interface';
import { AppSchemaId } from '../common/common.interface';
import { BlocksQueryResultUnion } from '../block/block.dto';

export const articlesQueryResolver = () => [Article];
export const articlesCountQueryResolver = () => Number;
export const articleQueryResolver = () => Article;
export const articleMutationResolver = () => Article;
export const articleTitleQueryResultResolver = () => [Article];
export const articleBlocksQueryResultResolver = () => [BlocksQueryResultUnion];

@Resolver(() => Article)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly caslService: CaslService,
  ) {}

  @Query(articlesQueryResolver)
  async articles() {
    return this.articleService.findAll();
  }

  @Query(articlesCountQueryResolver)
  async articlesCount() {
    return this.articleService.count();
  }

  @Query(articleQueryResolver)
  async article(@Args('input') input: ArticleInputFilter) {
    const foundArticle = await this.articleService.findOne(input);

    if (foundArticle == null) {
      throw new NotFoundException('Article not found');
    }
    return foundArticle;
  }

  @Query(articleTitleQueryResultResolver)
  async findArticlesByTitle(@Args('title') title: string) {
    return this.articleService.findManyByTitle(title);
  }

  @Mutation(articleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createArticle(
    @Args('input') input: ArticleInput,
    @AuthUser() user: User,
  ) {
    return this.articleService.create({ authorId: user._id, ...input });
  }

  @Mutation(articleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateArticle(
    @Args('input') input: ArticleInputUpdate,
    @AuthUser() user: User,
  ): Promise<Article> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.articleService.update(input);
  }

  @Mutation(articleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteArticle(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.articleService.deleteOne(id);
  }

  @ResolveField(articleBlocksQueryResultResolver)
  async blocks(@Parent() article: Article) {
    return this.articleService.resolveBlocks(article);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const article = await this.articleService.findOne({ _id });

    if (article == null) {
      throw new NotFoundException('Article not found');
    }
    const articleCheck = new Article();

    articleCheck.authorId = article.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, articleCheck);
  }
}
