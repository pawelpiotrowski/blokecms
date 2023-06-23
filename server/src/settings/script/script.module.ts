import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptResolver } from './script.resolver';
import { Script, ScriptSchema } from './script.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../../casl/casl.module';

@Module({
  exports: [ScriptService],
  imports: [
    MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]),
    CaslModule,
  ],
  providers: [ScriptService, ScriptResolver],
})
export class ScriptModule {}
