import { Module } from '@nestjs/common';
import { BankAccountService } from '@ambigbank/services';
import { BankAccountsController } from './bank-accounts.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AccountsApi } from '@ambigbank/client-bank-accounts';

@Module({
  imports: [JwtModule, ConfigModule, AuthModule],
  controllers: [BankAccountsController],
  providers: [
    {
      provide: BankAccountService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const accountsApi = new AccountsApi({
          basePath: configService.get('services.bankAccounts.url'),
          isJsonMime: () => true,
        });

        return new BankAccountService(accountsApi);
      },
    },
  ],
  exports: [BankAccountService],
})
export class BankAccountModule {}
