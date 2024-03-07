import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { AppLoggerMiddleware } from './middleware';

@Module({
  imports: [
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          signOptions: { expiresIn: '60m' },
          secret: configService.get<string>('jwt.secret'),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
