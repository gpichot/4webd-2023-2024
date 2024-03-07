import { Module } from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BankAccountService, NotificationsService } from '@ambigbank/services';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [TransfersController],
  providers: [TransfersService, BankAccountService, NotificationsService],
})
export class AppModule {}
