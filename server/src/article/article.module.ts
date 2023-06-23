import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { Article, ArticleSchema } from './article.schema';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { BlockMediaModule } from '../block/media/block-media.module';
import { BlockTextModule } from '../block/text/block-text.module';
import { BlockCodeModule } from '../block/code/block-code.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    CaslModule,
    BlockTextModule,
    BlockMediaModule,
    BlockCodeModule,
  ],
  providers: [ArticleService, ArticleResolver],
})
export class ArticleModule {}
