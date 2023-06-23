import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Navigation, NavigationSchema } from './navigation.schema';
import { NavigationService } from './navigation.service';
import { NavigationResolver } from './navigation.resolver';
import { PageModule } from '../../page/page.module';
import { CaslModule } from '../../casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Navigation.name, schema: NavigationSchema },
    ]),
    PageModule,
    CaslModule,
  ],
  providers: [NavigationService, NavigationResolver],
})
export class NavigationModule {}
