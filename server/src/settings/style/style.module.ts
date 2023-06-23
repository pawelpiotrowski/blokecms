import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../../casl/casl.module';
import { StyleResolver } from './style.resolver';
import { Style, StyleSchema } from './style.schema';
import { StyleService } from './style.service';

@Module({
  exports: [StyleService],
  imports: [
    MongooseModule.forFeature([{ name: Style.name, schema: StyleSchema }]),
    CaslModule,
  ],
  providers: [StyleResolver, StyleService],
})
export class StyleModule {}
