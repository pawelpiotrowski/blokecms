import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockMedia, BlockMediaSchema } from './block-media.schema';
import { BlockMediaService } from './block-media.service';
import { BlockMediaResolver } from './block-media.resolver';
import { BlockModule } from '../block.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockMedia.name, schema: BlockMediaSchema },
    ]),
    forwardRef(() => BlockModule),
  ],
  providers: [BlockMediaService, BlockMediaResolver],
  exports: [BlockMediaService],
})
export class BlockMediaModule {}
