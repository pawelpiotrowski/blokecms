import { Module, forwardRef } from '@nestjs/common';
import { BlockTextModule } from './text/block-text.module';
import { BlockMediaModule } from './media/block-media.module';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { CaslModule } from '../casl/casl.module';
import { BlockCodeModule } from './code/block-code.module';

@Module({
  imports: [
    forwardRef(() => BlockTextModule),
    forwardRef(() => BlockMediaModule),
    forwardRef(() => BlockCodeModule),
    CaslModule,
  ],
  providers: [BlockService, BlockResolver],
  exports: [BlockService],
})
export class BlockModule {}
