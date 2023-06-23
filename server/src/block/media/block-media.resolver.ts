import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthGqlGuard } from '../../auth/auth.gql.guard';
import { CaslAction } from '../../casl/casl.interface';
import { User } from '../../user/user.schema';
import { BlockType } from '../block.interface';
import { BlockService } from '../block.service';
import {
  BlockMediaInput,
  BlockMediaInputFilter,
  BlockMediaInputUpdate,
} from './block-media.dto';
import { BlockMedia } from './block-media.schema';
import { BlockMediaService } from './block-media.service';

export const blocksMediaQueryResolver = () => [BlockMedia];
export const blocksMediaCountQueryResolver = () => Number;
export const blockMediaQueryResolver = () => BlockMedia;
export const blockMediaMutationResolver = () => BlockMedia;

@Resolver()
export class BlockMediaResolver {
  constructor(
    private readonly blockMediaService: BlockMediaService,
    private readonly blockService: BlockService,
  ) {}

  @Query(blocksMediaQueryResolver)
  async blocksMedia() {
    return this.blockMediaService.findAll();
  }

  @Query(blocksMediaCountQueryResolver)
  async blocksMediaCount() {
    return this.blockMediaService.count();
  }

  @Query(blockMediaQueryResolver)
  async blockMedia(@Args('input') input: BlockMediaInputFilter) {
    const foundBlock = await this.blockMediaService.findOne(input);

    if (foundBlock == null) {
      this.blockService.throwBlockNotFound();
    }
    return foundBlock;
  }

  @Mutation(blockMediaMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createBlockMedia(
    @Args('input') input: BlockMediaInput,
    @AuthUser() user: User,
  ) {
    return this.blockMediaService.create({
      authorId: user._id,
      kind: BlockType.Media,
      ...input,
    });
  }

  @Mutation(blockMediaMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateBlockMedia(
    @Args('input') input: BlockMediaInputUpdate,
    @AuthUser() user: User,
  ) {
    const block = await this.blockMediaService.findOne({ _id: input._id });

    await this.blockService.checkAbility(
      user,
      CaslAction.Update,
      block,
      new BlockMedia(),
    );

    return this.blockMediaService.update(input);
  }

  @Mutation(blockMediaMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteBlockMedia(@Args('id') id: string, @AuthUser() user: User) {
    const block = await this.blockMediaService.findOne({ _id: id });

    await this.blockService.checkAbility(
      user,
      CaslAction.Delete,
      block,
      new BlockMedia(),
    );

    return this.blockMediaService.deleteOne(id);
  }
}
