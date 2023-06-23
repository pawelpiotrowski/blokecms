import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockText, BlockTextSchema } from './block-text.schema';
import { BlockTextService } from './block-text.service';
import { BlockTextResolver } from './block-text.resolver';
import { BlockModule } from '../block.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockText.name, schema: BlockTextSchema },
    ]),
    forwardRef(() => BlockModule),
  ],
  providers: [BlockTextService, BlockTextResolver],
  exports: [BlockTextService],
})
export class BlockTextModule {}
