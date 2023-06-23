import { Args, Query, Resolver } from '@nestjs/graphql';
import { BlocksQueryResultUnion } from './block.dto';
import { BlockType } from './block.interface';
import { BlockService } from './block.service';

export const blockKindQueryResolver = () => BlockType;
export const blockNameQueryResolver = () => String;
export const blockNameQueryResultResolver = () => [BlocksQueryResultUnion];

@Resolver()
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @Query(blockKindQueryResolver)
  async blockKind(@Args('id') id: string) {
    const block = await this.blockService.findOneById(id);

    if (block == null) {
      this.blockService.throwBlockNotFound();
    }
    return block.kind;
  }

  @Query(blockNameQueryResolver)
  async blockName(@Args('id') id: string) {
    const block = await this.blockService.findOneById(id);

    if (block == null) {
      this.blockService.throwBlockNotFound();
    }
    return block.name;
  }

  @Query(blockNameQueryResultResolver)
  async findBlocksByName(@Args('name') name: string) {
    return this.blockService.findManyByName(name);
  }
}
