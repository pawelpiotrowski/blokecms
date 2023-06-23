import { Module } from '@nestjs/common';
import { ScriptModule } from '../settings/script/script.module';
import { StyleModule } from '../settings/style/style.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  controllers: [ClientController],
  imports: [StyleModule, ScriptModule],
  providers: [ClientService],
})
export class ClientModule {}
