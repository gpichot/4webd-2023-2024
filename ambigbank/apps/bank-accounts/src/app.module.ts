import { Module } from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from './bank-accounts.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountService],
})
export class AppModule {}
