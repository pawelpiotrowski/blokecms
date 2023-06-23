import { forwardRef, Module } from '@nestjs/common';
import { BlockCodeService } from './block-code.service';
import { BlockCodeResolver } from './block-code.resolver';
import { BlockModule } from '../block.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockCode, BlockCodeSchema } from './block-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockCode.name, schema: BlockCodeSchema },
    ]),
    forwardRef(() => BlockModule),
  ],
  providers: [BlockCodeService, BlockCodeResolver],
  exports: [BlockCodeService],
})
export class BlockCodeModule {}
