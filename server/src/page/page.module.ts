import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { PageResolver } from './page.resolver';
import { Page, PageSchema } from './page.schema';
import { PageService } from './page.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    CaslModule,
  ],
  exports: [PageService],
  providers: [PageResolver, PageService],
})
export class PageModule {}
