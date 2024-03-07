import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from './bank-accounts.service';

@Module({
  imports: [CommonModule],
  controllers: [BankAccountsController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
