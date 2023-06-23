import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUserDecoded } from '../auth/auth.interface';
import { CaslAction } from '../casl/casl.interface';
import { CaslService } from '../casl/casl.service';
import { AppSchemaId } from '../common/common.interface';
import { BlockUnion } from './block.interface';
import { BlockMedia } from './media/block-media.schema';
import { BlockMediaService } from './media/block-media.service';
import { BlockText } from './text/block-text.schema';
import { BlockTextService } from './text/block-text.service';
import { BlockCode } from './code/block-code.schema';
import { BlockCodeService } from './code/block-code.service';

@Injectable()
export class BlockService {
  constructor(
    private readonly blockMediaService: BlockMediaService,
    private readonly blockTextService: BlockTextService,
    private readonly blockCodeService: BlockCodeService,
    private readonly caslService: CaslService,
  ) {}

  async findOneById(id: AppSchemaId) {
    const input = { _id: id };
    let block: BlockText | BlockMedia | BlockCode;
    for (const blockService of this.blockServices) {
      block = await blockService.findOne(input);

      if (block && block._id) {
        break;
      }
    }
    return block;
  }

  async findManyByName(
    name: string,
  ): Promise<Array<BlockText | BlockMedia | BlockCode>> {
    let result = [];
    const sanitizeName = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

    if (sanitizeName.length < 1) {
      return result;
    }
    // regex reference: https://github.com/scopsy/nestjs-monorepo-starter/blob/903cda1938c400e947f60d68595fb22ca7ea2795/apps/api/src/app/shared/crud/mongoose-crud.service.ts
    const nameRegex =
      sanitizeName.length === 1
        ? // name starts with
          new RegExp(`^${sanitizeName}`, 'i')
        : // name contains
          new RegExp(`${sanitizeName}`, 'i');

    for (const blockService of this.blockServices) {
      const blocks = await blockService.findManyByName(nameRegex);

      result = [...result.concat(blocks)];
    }

    return result as [BlockText, BlockMedia, BlockCode];
  }

  throwBlockNotFound() {
    throw new NotFoundException('Block not found');
  }

  async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    block: BlockUnion,
    blockCheck: BlockUnion,
  ) {
    if (block == null) {
      this.throwBlockNotFound();
    }

    blockCheck.authorId = block.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, blockCheck);
  }

  private get blockServices() {
    return [
      this.blockMediaService,
      this.blockTextService,
      this.blockCodeService,
    ];
  }
}
