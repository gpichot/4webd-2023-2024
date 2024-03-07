import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from './bank-account.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule, ConfigModule],
  controllers: [BankAccountsController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
