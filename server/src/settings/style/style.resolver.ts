import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthGqlGuard } from '../../auth/auth.gql.guard';
import { AuthUserDecoded } from '../../auth/auth.interface';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';
import { StyleInput, StyleInputFilter, StyleInputUpdate } from './style.dto';
import { Style } from './style.schema';
import { StyleService } from './style.service';

export const stylesQueryResolver = () => [Style];
export const styleQueryResolver = () => Style;
export const styleMutationResolver = () => Style;

@Resolver()
export class StyleResolver {
  constructor(
    private readonly styleService: StyleService,
    private readonly caslService: CaslService,
  ) {}

  @Query(stylesQueryResolver)
  async styles() {
    return this.styleService.findAll();
  }

  @Query(styleQueryResolver)
  async style(@Args('input') input: StyleInputFilter) {
    const foundStyle = await this.styleService.findOne(input);

    if (foundStyle == null) {
      throw new NotFoundException('Style not found');
    }
    return foundStyle;
  }

  @Mutation(styleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createStyle(@Args('input') input: StyleInput, @AuthUser() user: User) {
    return this.styleService.create({ authorId: user._id, ...input });
  }

  @Mutation(styleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateStyle(
    @Args('input') input: StyleInputUpdate,
    @AuthUser() user: User,
  ): Promise<Style> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.styleService.update(input);
  }

  @Mutation(styleMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteStyle(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.styleService.deleteOne(id);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const style = await this.styleService.findOne({ _id });

    if (style == null) {
      throw new NotFoundException('Style not found');
    }
    const styleCheck = new Style();

    styleCheck.authorId = style.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, styleCheck);
  }
}
