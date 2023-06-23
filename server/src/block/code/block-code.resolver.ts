import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthGqlGuard } from '../../auth/auth.gql.guard';
import { CaslAction } from '../../casl/casl.interface';
import { User } from '../../user/user.schema';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import {
  BlockCodeInput,
  BlockCodeInputFilter,
  BlockCodeInputUpdate,
} from './block-code.dto';
import { BlockCode } from './block-code.schema';
import { BlockCodeService } from './block-code.service';

export const blocksCodeQueryResolver = () => [BlockCode];
export const blocksCodeCountQueryResolver = () => Number;
export const blockCodeQueryResolver = () => BlockCode;
export const blockCodeMutationResolver = () => BlockCode;

@Resolver()
export class BlockCodeResolver {
  constructor(
    private readonly blockCodeService: BlockCodeService,
    private readonly blockService: BlockService,
  ) {}

  @Query(blocksCodeQueryResolver)
  async blocksCode() {
    return this.blockCodeService.findAll();
  }

  @Query(blocksCodeCountQueryResolver)
  async blocksCodeCount() {
    return this.blockCodeService.count();
  }

  @Query(blockCodeQueryResolver)
  async blockCode(@Args('input') input: BlockCodeInputFilter) {
    const foundBlock = await this.blockCodeService.findOne(input);

    if (foundBlock == null) {
      this.blockService.throwBlockNotFound();
    }
    return foundBlock;
  }

  @Mutation(blockCodeMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createBlockCode(
    @Args('input') input: BlockCodeInput,
    @AuthUser() user: User,
  ) {
    return this.blockCodeService.create({
      authorId: user._id,
      kind: BlockType.Code,
      ...input,
    });
  }

  @Mutation(blockCodeMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateBlockCode(
    @Args('input') input: BlockCodeInputUpdate,
    @AuthUser() user: User,
  ) {
    const block = await this.blockCodeService.findOne({ _id: input._id });

    await this.blockService.checkAbility(
      user,
      CaslAction.Update,
      block,
      new BlockCode(),
    );

    return this.blockCodeService.update(input);
  }

  @Mutation(blockCodeMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteBlockCode(@Args('id') id: string, @AuthUser() user: User) {
    const block = await this.blockCodeService.findOne({ _id: id });

    await this.blockService.checkAbility(
      user,
      CaslAction.Delete,
      block,
      new BlockCode(),
    );

    return this.blockCodeService.deleteOne(id);
  }
}
