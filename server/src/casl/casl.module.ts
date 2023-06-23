import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslService } from './casl.service';

@Module({
  providers: [CaslAbilityFactory, CaslService],
  exports: [CaslService],
})
export class CaslModule {}
