import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { BankAccountModule } from './features/bank-accounts/bank-account.module';
import { TransferModule } from './features/transfers/transfers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppLoggerMiddleware } from './middleware';

@Module({
  imports: [
    AuthModule,
    BankAccountModule,
    TransferModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
