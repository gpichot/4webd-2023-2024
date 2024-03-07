import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { UsersApi } from '@ambigbank/client-users';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          signOptions: { expiresIn: '60m' },
          secret: configService.get<string>('JWT_KEY'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: UserService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const usersApi = new UsersApi({
          basePath: configService.get<string>('services.users.url'),
          isJsonMime: () => true,
        });
        return new UserService(usersApi);
      },
    },
    AuthGuard,
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
