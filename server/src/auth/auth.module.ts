import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { appConfigNameSpace } from '../app.config';
import { AppConfig, DotEnvVar } from '../app.config.interface';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthStrategy } from './auth.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>(DotEnvVar.jwtKey);
        const {
          api: {
            auth: { expiresIn },
          },
        } = configService.get<AppConfig>(appConfigNameSpace);

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
