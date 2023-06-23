import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig, appConfigNameSpace } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppConfig } from './app.config.interface';
import { PageModule } from './page/page.module';
import { BlockModule } from './block/block.module';
import { UploadModule } from './upload/upload.module';
import { ArticleModule } from './article/article.module';
import { NavigationModule } from './settings/navigation/navigation.module';
import { StyleModule } from './settings/style/style.module';
import { ScriptModule } from './settings/script/script.module';

@Module({
  imports: [
    /**
     * Adds nestjs configuration service
     * and loads custom configs.
     * This service can be availabled/disabled globally in app:
     * `isGlobal: boolean`
     * More: https://docs.nestjs.com/techniques/configuration#use-module-globally
     */
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      cache: true,
    }),
    /**
     * Adds graphql and use dynamic config to set it up.
     */
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const plugins = [];
        const config = configService.get<AppConfig>(appConfigNameSpace);

        if (config.isDev) {
          plugins.push(ApolloServerPluginLandingPageLocalDefault());
        }
        return {
          cache: 'bounded',
          path: config.gql.url,
          playground: false,
          plugins,
          autoSchemaFile: config.gql.autoSchemaFile,
        };
      },
      inject: [ConfigService],
    }),
    /**
     * Adds mongoose and use dynamic config to set it up.
     * Similar to typeorm you can also add `connectionName` property in case there is multiple typeorm instances
     * More: https://docs.nestjs.com/techniques/mongodb#multiple-databases
     */
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<AppConfig>(appConfigNameSpace).db.url,
        /**
         * https://mongoosejs.com/docs/deprecations.html#findandmodify
         */
        // useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    /**
     * Enable rate limit in the app
     * This needs to be enabled per controller/resolver/single request:
     *
     * `@UseGuards(ThrottlerGuard)`
     *
     * and in ex. limit to 5 requests within 10 seconds:
     *
     * `@Throttle(limit: number = 5, ttl: number = 10)`
     */
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config =
          configService.get<AppConfig>(appConfigNameSpace).api.rateLimit;
        const hasIgnoreUserAgents =
          config.ignoreUserAgents && config.ignoreUserAgents.length > 0;
        const uaRegexArray: RegExp[] = [];

        if (hasIgnoreUserAgents) {
          config.ignoreUserAgents.forEach((ua) => {
            uaRegexArray.push(new RegExp(ua, 'gi'));
          });
        }

        return {
          ttl: 0,
          limit: 0,
          ...(hasIgnoreUserAgents && { ignoreUserAgents: uaRegexArray }),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    UploadModule,
    /**
     * Client module has to be imported after any module declaring `@Get`
     * as client ctrl can declare wildcard GET route
     */
    ClientModule,
    PageModule,
    BlockModule,
    ArticleModule,
    NavigationModule,
    StyleModule,
    ScriptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
