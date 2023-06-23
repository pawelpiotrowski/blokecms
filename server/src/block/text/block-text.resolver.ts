import { UseGuards } from '@nestjs/common';
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
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import {
  BlockTextInput,
  BlockTextInputFilter,
  BlockTextInputUpdate,
} from './block-text.dto';
import { BlockText } from './block-text.schema';
import { BlockTextService } from './block-text.service';

export const blocksTextQueryResolver = () => [BlockText];
export const blocksTextCountQueryResolver = () => Number;
export const blockTextQueryResolver = () => BlockText;
export const blockTextMutationResolver = () => BlockText;
export const blockTextHtmlIncludeWebComponentTagsQueryResultResolver = () =>
  String;

@Resolver(() => BlockText)
export class BlockTextResolver {
  constructor(
    private readonly blockTextService: BlockTextService,
    private readonly blockService: BlockService,
  ) {}

  @Query(blocksTextQueryResolver)
  async blocksText() {
    return this.blockTextService.findAll();
  }

  @Query(blocksTextCountQueryResolver)
  async blocksTextCount() {
    return this.blockTextService.count();
  }

  @Query(blockTextQueryResolver)
  async blockText(@Args('input') input: BlockTextInputFilter) {
    const foundBlock = await this.blockTextService.findOne(input);

    if (foundBlock == null) {
      this.blockService.throwBlockNotFound();
    }
    return foundBlock;
  }

  @Mutation(blockTextMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createBlockText(
    @Args('input') input: BlockTextInput,
    @AuthUser() user: User,
  ) {
    return this.blockTextService.create({
      authorId: user._id,
      kind: BlockType.Text,
      ...input,
    });
  }

  @Mutation(blockTextMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateBlockText(
    @Args('input') input: BlockTextInputUpdate,
    @AuthUser() user: User,
  ): Promise<BlockText> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.blockTextService.update(input);
  }

  @Mutation(blockTextMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteBlockText(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.blockTextService.deleteOne(id);
  }

  @ResolveField(blockTextHtmlIncludeWebComponentTagsQueryResultResolver)
  htmlIncludeWebComponentTags(@Parent() blockText: BlockText) {
    return this.blockTextService.includeWebComponentTags(blockText);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const block = await this.blockTextService.findOne({ _id });

    await this.blockService.checkAbility(user, action, block, new BlockText());
  }
}
