import { Module } from '@nestjs/common';
import { BankAccountService } from '@ambigbank/services';
import { CommonModule } from 'src/services/common.module';
import { BankAccountsController } from './bank-accounts.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CommonModule, JwtModule, ConfigModule, AuthModule],
  controllers: [BankAccountsController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
