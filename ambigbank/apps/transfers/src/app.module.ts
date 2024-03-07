import { Module } from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { BankAccountService, NotificationsService } from '@ambigbank/services';
import { AccountsApi } from '@ambigbank/client-bank-accounts';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [TransfersController],
  providers: [
    TransfersService,
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
    NotificationsService,
  ],
})
export class AppModule {}
