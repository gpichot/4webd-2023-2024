import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransfersApi } from '@ambigbank/client-transfers';

@Module({
  imports: [JwtModule, AuthModule, ConfigModule, BankAccountModule],
  controllers: [TransfersController],
  providers: [
    {
      provide: TransfersService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const transfersApi = new TransfersApi({
          basePath: configService.get('services.transfers.url'),
          isJsonMime: () => true,
        });
        return new TransfersService(transfersApi);
      },
    },
  ],
})
export class TransferModule {}
