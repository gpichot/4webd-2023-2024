import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonModule } from './services/common.module';
import { AuthModule } from './features/auth/auth.module';
import { BankAccountModule } from './features/bank-accounts/bank-account.module';
import { TransferModule } from './features/transfers/transfers.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    CommonModule,
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
export class AppModule {}
